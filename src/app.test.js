import { mount, shallow } from 'enzyme';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import App from './app';

describe('Upload File Component', () => {

  const csvData = `Name,Email Id,Phone Number,status,course,Option for Career,tags,experience
  Aarav Singh,aaravsingh@gmail.com,9876543210,Paid,Marketing,Job,"SEO, Analytics",2 years
  Aditi Gupta,aditigupta@hotmail.com,8765432109,Pending,IT,"Entrepreneur	Development, Design",3 years
  Akash Patel,akashpatel@gmail.com,7654321098,Paid,Finance,Job,"Accounting, Investment",5 years
  Alisha Sharma,alishasharma@yahoo.com,6543210987,Pending,HR,Job,"Recruitment, Employee",1 year
  `;

  const textData = 'This is text data';

  let wrapper;
  beforeEach(()=>{
    wrapper = mount(<SnackbarProvider><App /></SnackbarProvider>);
  })

  it('Render Label correctly', () => {
    expect(wrapper.find('label').text()).toContain('Upload File');
  });

  it('Render Input correctly',()=>{
    expect(wrapper.find('input[type="file"]').length).toBe(1);
  });

  it('Check if File is parsing',async ()=>{
    // const expectedHeader = ["Name","Email Id","Phone","Number","status","course","Option for Career","tags","experience"]
    const input = wrapper.find('input[type="file"]');
    const csvFile = new File([csvData],"test.csv",{type:'text/csv'});
    input.simulate('change',{target:{files:[csvFile]}});    
    wrapper.update();
    expect(wrapper.find('#notistack-snackbar').text()).toBe('Parsing File');
  });
});