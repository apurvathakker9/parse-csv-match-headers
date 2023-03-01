import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Typography } from '@material-ui/core';
import { Close, CloudUploadOutlined, Publish } from '@material-ui/icons';
import React, { useState } from 'react'
import NavBar from './components/NavBar';
import useFileUpload from './hooks/useFileUpload';

export default function App(){

  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const { parseFile, csvHeaders, headerToDataLabel, 
    handleSelectChange, fileName, importFile, dataKeyToLabel } = useFileUpload();

  const handleDialogClose = ()=>{
    setShowMappingDialog(false);
  }

  const handleFileChange = async (e)=>{
    await parseFile(e);
    setShowMappingDialog(true);
  }

  const onImportClick = async (event)=>{
    await importFile();
    setShowMappingDialog(false);
  }

  return (
    <>
      <div>
        <NavBar />
        <div className='container custom-container'>
          <input hidden type='file' name='fileInput' accept=".csv" onChange={handleFileChange} id='fileInput'></input>
          <label className='upload-file-section p-3' htmlFor='fileInput'>
            <div className='border custom-border w-100 h-100'>
              <div className='d-flex align-items-center h-100 w-100 justify-content-center flex-column gap-5'>
                <CloudUploadOutlined className='mr-1' style={{fontSize: '3rem'}} />
                <Typography variant='h6'>Upload File</Typography>
              </div>
            </div>
          </label>
        </div>
        <Dialog
          open={showMappingDialog}
          maxWidth={'md'}
          fullWidth
        >
          <DialogTitle>
            <div className='d-flex justify-content-between align-items-center'>
              <Typography variant='h6' className='font-weight-bold'>Map Headers</Typography>
              <IconButton onClick={handleDialogClose}><Close/></IconButton>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className='alert alert-success' role="alert">
              File Name: <span id='file-name'><b>{fileName}</b></span>
            </div>
            <div className='my-5'>
              <h5>Header identifiers</h5>
              <div className='container'>
                <div className='p-4'>
                  <div className='row'>
                    <div className='col-6'>
                      <Typography color='primary'>CSV Hedaers</Typography>
                    </div>
                    <div className='col-6'>
                      <Typography color='primary' className='text-center'>Map to Attributes</Typography>
                    </div>
                  </div>
                  {csvHeaders.map((header,ind)=>(
                    <div key={header} className='form-group row my-2 align-items-end'>
                      <div className='col-6'>
                        <label>{header}</label>
                      </div>
                      <div className='col-6'>
                        <Select
                          variant='outlined'
                          name={header}
                          fullWidth
                          value={headerToDataLabel[header] ? headerToDataLabel[header]:''}
                          onChange={handleSelectChange}
                        >
                          <MenuItem value='UNASSIGNED'>Leave Unassigned</MenuItem>
                          {Object.keys(dataKeyToLabel).map((dataKey)=>(
                            <MenuItem key={header+dataKey} value={dataKey}>{dataKeyToLabel[dataKey]}</MenuItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <span className='font-weight-bold'>Notes:</span>
              <ul>
                <li>Since the image was not clear, writing down some notes here</li>
                <li>The project is completed using Material UI & XSLX for parsing file</li>
                <li>The project is bundled using webpack</li>
              </ul>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} variant='outlined' color='secondary'>Cancel</Button>
            <Button startIcon={<Publish />} onClick={onImportClick} variant='contained' color='primary'>Import</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}