
    const web3 = new Web3('https://ropsten.infura.io/v3/3d6f9b3852cf4af29749596eb9af6086');
    const contractAddress = "0x9062b758469077CA7ff325D67867513ed37eA95F";  //ganache= 0xD200dFEf1f82Ee4Bd8F52CC4731C3Fe084a963cd ropsten= "0x9062b758469077CA7ff325D67867513ed37eA95F"
    var contract = new web3.eth.Contract(abi, contractAddress);
    contract.setProvider(window.ethereum);

  
  
  //Meta maks connect to wallet
  window.userWalletAddress = null
  const loginButton = document.getElementById('loginButton');
  const userWallet = document.getElementById('userWallet');
  
  //Display users relationship
  const displayTitle = document.getElementById('display');
  const firstPersonDisplay = document.getElementById('first_person_display');
  const secondPersonDisplay = document.getElementById('second_person_display');
  const statusDisplay = document.getElementById('status_display');
  const kidsDisplay = document.getElementById('kids_display');
  const btnDisplay = document.getElementById('display_relationship');
  btnDisplay.onclick = displayRelationship;

  //Create relationship
  const firstPersonInput = document.getElementById('first_person');
  const secondPersonInput = document.getElementById('second_person');
  const statusInput = document.getElementById('status');
  const kidsInput = document.getElementById('kids');
  const btnCreateRelationship = document.getElementById('create_relationship');
  btnCreateRelationship.onclick = createRelationship;
  
  //Its not woking out 
  const personName = document.getElementById("person_name");
  const destroyRelathionship = document.getElementById("destroy_relathionship");
  destroyRelathionship.onclick = divorce;
  
  //Add kids 
  const addKidsInput = document.getElementById('add_kids');
  const btnAddKids = document.getElementById("btn_add_kids");
  btnAddKids.onclick = addKids;
  
function toggleButton() {
    if (!window.ethereum) {
      loginButton.innerText = 'MetaMask is not installed'
      loginButton.classList.remove('bg-purple-500', 'text-white')
      loginButton.classList.add('bg-gray-500', 'text-gray-100', 'cursor-not-allowed')
      return false
    }
  
    loginButton.addEventListener('click', loginWithMetaMask)
  }
  
async function loginWithMetaMask() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((e) => {
        console.error(e.message)
        return
      })
    if (!accounts) { return }
  
    window.userWalletAddress = accounts[0]
    userWallet.innerText = window.userWalletAddress
    loginButton.innerText = 'Sign out of MetaMask'
  
    loginButton.removeEventListener('click', loginWithMetaMask)
    setTimeout(() => {
      loginButton.addEventListener('click', signOutOfMetaMask)
    }, 200)
}
  
function signOutOfMetaMask() {
    window.userWalletAddress = null
    userWallet.innerText = ''
    loginButton.innerText = 'Sign in with MetaMask'
  
    loginButton.removeEventListener('click', signOutOfMetaMask)
    setTimeout(() => {
      loginButton.addEventListener('click', loginWithMetaMask)
    }, 200)
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    toggleButton()
  });

  async function userHasARelationship(){
    let result =  await contract.methods.addressToRelationship(window.userWalletAddress).call({from: window.userWalletAddress});
    if(result.creator == "0x0000000000000000000000000000000000000000"){
        return false;
    }else{
        return true;
    }
  }
  

  async function displayRelationship(){
    if(window.userWalletAddress == null){
        await loginWithMetaMask();
    }
    let result =  await contract.methods.addressToRelationship(window.userWalletAddress).call({from: window.userWalletAddress});
    console.log(result);
    if(result.creator == "0x0000000000000000000000000000000000000000"){
        displayTitle.innerHTML = "You have not yet created a relationship."
        return;
    }else{
        displayTitle.innerHTML = "Your relationship: ";
    }

    let status = "";
    if(result.status == 0){
         status = "Single"
    }else if(result.status == 1){
         status = "Taken";
    }else{
         status = "Married";
    }
    firstPersonDisplay.innerHTML="First person: " + result.first_person;
    secondPersonDisplay.innerHTML="Second person: " + result.second_person;
    statusDisplay.innerHTML= "Relationship status: " + status;
    kidsDisplay.innerHTML= "Number of kids: " + result.kids;

}
  
  async function createRelationship(){
    if(window.userWalletAddress == null){
        await loginWithMetaMask();
    }
    
    await contract.methods.createRelationship(firstPersonInput.value, secondPersonInput.value, statusInput.value, kidsInput.value).send({from: window.userWalletAddress});
  }
  async function divorce(){
    
    if(window.userWalletAddress == null){
        await loginWithMetaMask();
    }
    
    if(await userHasARelationship()){
        await contract.methods.itsNotWorking(personName.value).send({from: window.userWalletAddress});
    }else{
        alert("You dont have a relationship to destroy");
    }
  }
  
  async function addKids(){
    if(window.userWalletAddress == null){
        await loginWithMetaMask();
    }

    if(await userHasARelationship()){
     await contract.methods.addKids(addKidsInput.value).send({from: window.userWalletAddress});
        

    }else{
        alert("You dont have a relationship to add your kids to. First create a relationship");
    }
  }