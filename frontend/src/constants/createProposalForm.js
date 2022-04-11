import * as yup from 'yup';

export const fieldsPart0 = [
    {
      type: "text",
      title: "Proposal Title",
      bindValue: "proposalTitle",
      required: true,
      disabled: false,
      disabledOnUpdate: true
    },
    {
      type: "optionSelect",
      title: "What Earmark are you applying to?",
      bindValue: "proposalEarmark",
      required: true,
      options: [
        {
          value: "coretech",
          text: "Core-Tech",
        },
        {
          value: "general",
          text: "General",
        },
      ],
    },
    {
      type: "text",
      title: "Proposal in one sentence",
      bindValue: "oneLiner",
      required: true
    },
    {
      type: "largeText",
      title: "Proposal Description",
      bindValue: "proposalDescription",
      rows: 10,
      placeHolder: `Description of the proposal.`,
    },
    {
      type: "largeText",
      title: "Grant Deliverables",
      bindValue: "grantDeliverables",
      required: true,
      placeHolder: `__(Grant Deliverable 1)__
__(Grant Deliverable 2)__
__(Grant Deliverable 3)__`
    },
    {
      type: "largeText",
      title: "Value Add Criteria",
      bindValue: "valueAddCriteria",
      required: true,
      placeHolder: `How does the project and proposal add value to Ocean ecosystem?
Usage of Ocean — how well might the project drive usage of Ocean?
Viability — what is the chance of success of the project?
Community Engagement — How active is the team in the community?
Community Value — How does the project add value to the overall Ocean Community / Ecosystem?`
    },
    {
      type: "text",
      title: "Funding Requested (USD)",
      bindValue: "proposalFundingRequested",
      required: true,
      textFormat: "number",
      importantText:
        "The amount requested is in USD, but the amount paid is in OCEAN token. The conversion rate is calculated at Vote End, so payment is completed as quickly as possible. This determines how many OCEAN will be awarded if a proposal is voted to receive a grant.",
    },
    {
      type: "text",
      title: "Minimum Funding Requested (USD)",
      bindValue: "minUsdRequested",
      required: true,
      textFormat: "number",
      importantText:
        "The amount of minimum funding requested is in USD, but the amount paid is in OCEAN token. The conversion rate is calculated at Vote End, so payment is completed as quickly as possible. This determines how many OCEAN will be awarded if a proposal is voted to receive a grant.",
    },
    {
      type: "text",
      title: "Proposal Wallet Address",
      bindValue: "proposalWalletAddress",
      placeHolder: "0x...",
      required: true,
      importantText:
        "Must have minimum 500 OCEAN in wallet to be eligible. This wallet is where you will receive the grant amount if selected",
    },
  ];

export const validationSchema= yup.object().shape({
    proposalTitle: yup.string().required("Proposal title is required"),
    proposalEarmark: yup.string().required("Proposal earmark is required"),
    oneLiner: yup.string().required("Proposal one liner is required"),
    proposalDescription: yup.string().required("Proposal description is required"),
    grantDeliverables: yup.string().required("Grant deliverables are required"),
    valueAddCriteria: yup.string().required("Value add criteria is required"),
    proposalFundingRequested: yup.number("Funding requested should be a number").required("Funding requested is required").min(3000, "Funding requested should be grater or equal to 3000"),
    minUsdRequested: yup.number("Minimum USD requested should be a number").required("Minimum USD requested is required").min(3000, "Minimum USD requested should be grater or equal to 3000"),
    proposalWalletAddress: yup.string().required("Proposal wallet address is required"),
})

export const initialValues= {
    proposalTitle: "", 
    proposalEarmark: "",
    oneLiner: "", 
    proposalDescription: "",
    grantDeliverables: "", 
    valueAddCriteria: "",
    proposalFundingRequested: 0, 
    minUsdRequested: 0,
    proposalWalletAddress: ""
  }