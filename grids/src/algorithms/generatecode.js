
function generateCode(){
    let code = [];

    for(let i = 0; i<8; i++){
        code.push(Math.floor(Math.random() * 10));
    }

    // let letter = "B";
    // let num = Math.floor(Math.random() * 3);

    // if(num  === 0){
    //     letter = "B"
    // }
    // else if(num === 1){
    //     letter = "A"
    // }
    // else{
    //     letter = "H"
    // }

    let finalCode = "B"+code[0]+code[1]+code[2]+"A"+code[3]+code[4]+"H"+code[5]+code[6]+code[7];
    
    return finalCode; 

}

console.log(generateCode());