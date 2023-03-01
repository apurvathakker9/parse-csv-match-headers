import React,{ useState } from 'react'
import useCustomSnackbar from './useCustomSnackbar';
import * as XLSX from 'xlsx';

const useFileUpload = ()=>{

  const dataKeyToLabel = {
    name: 'Name',
    phoneNumber: 'Phone Number',
    tags: 'Tags',
    email: 'Email',
    paymentStatus: 'Payment Status',
    coursesType: 'Courses Type',
    careerOption: 'Career Option',
    experience: 'Experience'
  };

  const [labelKey, setLabelKey] = useState({
    name: ['Contact Name','Person Name','Name','Name Person','First Name'],
    phoneNumber: ['Phone Number', 'Phone', 'Contact Number', 'Phone No.', 'Contact No.'],
    tags: ['Tags'],
    email: ['Email', 'Email Id', 'EmailId']
  })

  const [csvHeaders, setCsvHeaders] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState(undefined);
  const [headerToDataLabel, setHeaderToDataLabel] = useState({});
  const {showSnackbarAlert} = useCustomSnackbar();

  const readingFile = (file)=>{
    let reader = new FileReader();
    return new Promise((resolve,reject)=>{
      let dataParsed = {}
      try{
        reader.onload = (readEvent)=>{
          let regex = RegExp(/^.+\.(csv)$/);
          if(regex.test(file.name)){
            // Parse Data
            let rawData = readEvent.target.result;
            let workbook = XLSX.read(rawData,{type:'binary'});
            let ws = workbook.Sheets[workbook.SheetNames[0]];
            
            // get header
            const header = [];
            const data= [];
            const columnCount = XLSX.utils.decode_range(ws['!ref']).e.c + 1;
            for (let i = 0; i < columnCount; ++i) {
              var a = `${XLSX.utils.encode_col(i)}1`;
              if (a && ws[a]) {
                header[i] = ws[`${XLSX.utils.encode_col(i)}1`].v
              }
            }
            // Resolve Header, data and name of the file
            dataParsed = {
              header,data: XLSX.utils.sheet_to_json(ws),
              fileName: file.name
            }
          }
          resolve(dataParsed);
        }
        reader.readAsBinaryString(file);
      } catch(err){
        console.error(err);
        reject('Error in Reading file');
      }
    })
  }

  const parseFileValidation = (res)=>{
    for(let i=0;i<res.header.length;i++){
      const item = res.header[i];
      for(let j=0;j<res.data.length;j++){
        const data = res.data[j];
        if(item.toLowerCase().includes("name")){
          if(!(/^[a-zA-Z\s]+$/.test(data[item]))){
            return `Name not in correct format at row(${j+1}). Please check and upload again.`;
          }
        } else if(item.toLowerCase().includes('email')){
          if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){0,}$/i).test(data[item])){
            return `Email Not in correct format at row(${j+1}). Please check and upload again.`;
          }
        } else if(item.toLowerCase().includes('phone') || item.toLowerCase().includes('contact')){
          if(!(/^(\+91[\-\s]?)?[0]?(91)?[5-9]\d{9}$/).test(data[item])){
            return `Phone Number Not in correct format at row(${j+1}). Please check and upload again.`;
          }
        }
      }
    }
    return '';
  }

  const preMapDataLabels = (res)=>{
    let headerToLabel = {};
    res.header.forEach((head)=>{
      for(let label in labelKey){
        labelKey[label].forEach((substr)=>{
          if(headerToDataLabel[label]){
            return;
          }
          if(~(""+head).toLowerCase().indexOf(substr.toLowerCase())){
            headerToLabel[head] = label;
          }
        })
      }
    })
    return headerToLabel;
  }

  const parseFile = async (event)=>{
    showSnackbarAlert('Parsing File');
    const file = event.target.files[0];
    let prom = readingFile(file);
    let res = await prom;
    event.target.value = null;
    // Show error if no data in the file
    if(res.data.length === 0){
      showSnackbarAlert("File does not have rows. Please upload a new file","error")
      return;
    }
    // Apply validations on data to see if in correct format.
    let errorMessage = parseFileValidation(res);
    if(errorMessage !== ''){
      showSnackbarAlert(errorMessage,"error");
      return;
    }

    // Pre Map common Data Labels.
    let headerToLabel = preMapDataLabels(res);

    // Set State variables
    setCsvHeaders(res.header);
    setParsedData(res.data);
    setFileName(res.fileName);
    setHeaderToDataLabel(headerToLabel);
  }

  const handleSelectChange = (e,key)=>{
    const {name, value} = e.target;

    // If a mappping is unassigned, remove from object.
    if(value === 'UNASSIGNED'){
      const prevMapping = {...headerToDataLabel};
      delete prevMapping[name];
      setHeaderToDataLabel(prevMapping);
      return;
    }
    setHeaderToDataLabel((prevState)=>({
      ...prevState,[name]: value
    }))
  }

  // Import Data Function
  const importFile = async ()=>{
    let errorMessage = '';

    // If no labels are mapped
    if(Object.keys(headerToDataLabel).length === 0){
      showSnackbarAlert("No Data Label mapped","error")
      return;
    }

    let reqFields = 0;
    let dataArr = new Array(parsedData.length).fill({});

    const headerToDataLabelEntries = Object.entries(headerToDataLabel);

    for(let i=0;i<headerToDataLabelEntries.length;i++){
      const item = headerToDataLabelEntries[i];

      // Check if required fields are mapped or not
      if(item[1].includes('name') || item[1].includes('email') || item[1].includes('phone')){
        reqFields++;
      }

      for(let j=0;j<parsedData.length;j++){
        const data = parsedData[j];

        // Validating again to see if the columns were mapped correctly
        if(item[1].toLowerCase().includes("name")){
          if(!(/^[a-zA-Z\s]+$/.test(data[item[0]]))){
            errorMessage = `Name mapped to text not in correct format. Please check the mapping.`
            break;
          }
        } else if(item[1].toLowerCase().includes('email')){
          if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){0,}$/i).test(data[item[0]])){
            errorMessage = `Email mapped to text not in correct format. Please check the mapping.`;
            break;
          }
        } else if(item[1].toLowerCase().includes('phone')){
          if(!(/^(\+91[\-\s]?)?[0]?(91)?[5-9]\d{9}$/).test(data[item[0]])){
            errorMessage = `Phone Number mapped to text not in correct format. Please check the mapping.`
            break;
          }
        }

        // Manipulate the array with correct keys and values
        dataArr[j]= {...dataArr[j],[item[1]]:data[item[0]]};
      }

      if(errorMessage !== ''){
        break;
      }
    }

    if(errorMessage !== ''){
      showSnackbarAlert(errorMessage,"error");
      return;
    }

    if(reqFields < 3){
      showSnackbarAlert("Not all required Fields (Name, Email, Phone) mapped.","error")
      return;
    }    
    showSnackbarAlert("Importing Data","info");
    uploadData(dataArr);
  }

  // Upload Data Function
  const uploadData = (dataArr)=>{
    // Logic to upload the data in JSON format to the API.
    console.log(dataArr);

    // Send data to backend. We can use fetch API or axios to do the same.
    // Simulate API call.
    setTimeout(()=>{
      showSnackbarAlert("Data Imported Successfully","success");

      // Update State variables
      setCsvHeaders([]);
      setParsedData([]);
      setFileName(undefined);
      setHeaderToDataLabel({});
    },3000)
  }


  return {
    parseFile,
    csvHeaders,
    headerToDataLabel,
    handleSelectChange,
    fileName,
    importFile,
    dataKeyToLabel
  };

}

export default useFileUpload;