import React, { useState, useEffect } from 'react';
import { supabase } from '../../createClient'; // Import your Supabase client
import { notification } from 'antd'; // Import Ant Design notification

function CodeGenerator() {
  const [code, setCode] = useState('');

  useEffect(() => {
    generateUniqueCode();
  }, []);

  async function generateUniqueCode() {
    const existingCodes = await fetchCodesFromDatabase();
    const totalPossibleCodes = 10 ** 8; // Assuming there are 10^8 possible codes
    console.log(existingCodes);

    if (existingCodes.length >= totalPossibleCodes) {
      // Handle the case when all possible codes are used
      notification.error({
        message: 'Error',
        description: 'All possible codes are used.',
        placement: 'bottomRight',
      });
      return;
    }

    let newCode;
    do {
      newCode = generateCode();
    } while (existingCodes.includes(newCode));

    setCode(newCode);

    // Pass the generated code to the parent component
    onCodeGenerated(newCode);
  }

  async function fetchCodesFromDatabase() {
    // Fetch existing codes from your database (replace 'code' with your actual column name)
    const { data, error } = await supabase.from('transfers').select('codeNumber');
    if (error) {
      console.error('Error fetching codes:', error);
      return [];
    }
    return data.map(item => item.codeNumber);
  }

  function generateCode() {
    let code = [];

    for (let i = 0; i < 8; i++) {
      code.push(Math.floor(Math.random() * 10));
    }

    let finalCode = 'B' + code[0] + code[1] + code[2] + 'A' + code[3] + code[4] + 'H' + code[5] + code[6] + code[7];

    setCode(finalCode);
  }

  return <>{code}</>;
}

export default CodeGenerator;
