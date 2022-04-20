import { SERVER_URI } from "./config";

export const getNonce = async (address) => {
  const nonceResponse = await fetch(`${SERVER_URI}/app/nonce/${address}`);
  const data = await nonceResponse.json();
  return data.nonce;
};

export const getEarmarkOptions = (project) => {
  console.log(project)
  const grantsCompleted = project?.projectInfo?.grantsCompleted === 'New Project'
  let earmarkOptions
  if(grantsCompleted === 0){
    if(project?.project?.projectCategory === 'outreach'){
      earmarkOptions=[
        {
          value: "newprojectoutreach",
          text: "New Outreach",
        }
      ]
    }else{
      earmarkOptions=[
        {
          value: "newproject",
          text: "New Project",
        }
      ]
    }
  }else if(grantsCompleted === 2 || grantsCompleted === 3){
    earmarkOptions=[
      {
        value: "2nd/3rdgrant",
        text: "2nd/3rd Grant",
      }
    ]
  }else{
    earmarkOptions=[
     {
        value: "general",
        text: "General",
      },
      {
        value: "coretech",
        text: "Core Tech",
      }
    ]
  }
  return earmarkOptions
}
