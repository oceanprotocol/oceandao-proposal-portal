import * as yup from 'yup';

export const fieldsPart0 = [
    {
      type: "text",
      title: "Name of Project",
      bindValue: "projectName",
      required: true,
      wrong: false,
      disabled: false,
    },
    {
      type: "optionSelect",
      title: "Project Category",
      bindValue: "projectCategory",
      wrong: false,
      disabled: false,
      required: true,
      options: [
        {
          value: "build",
          text: "Build / improve applications or integrations to Ocean",
        },
        {
          value: "outreach",
          text: "Outreach / community / spread awareness (grants don't need to be technical in nature)",
        },
        {
          value: "unleash",
          text: "Unleash data",
        },
        {
          value: "buildcore",
          text: "Build / improve core software",
        },
        {
          value: "improvedao", //TODO Change these
          text: "Improvements to OceanDAO",
        },
      ],
    },
    {
      type: "largeText",
      title: "Project Description",
      bindValue: "projectDescription",
      required: true,
      placeHolder: "Description of the project and what problem is it solving",
      wrong: false,
    },
    {
      type: "largeText",
      title: "What is the final product?",
      bindValue: "finalProduct",
      placeHolder: "1-2 sentences describing the final product",
      wrong: false,
      required: true,
    },
    {
      type: "text",
      title: "Project lead full name",
      bindValue: "projectLeadFullName",
      placeHolder: "first name last name",
      wrong: false,
      required: true,
    },
    {
      type: "text",
      title: "Project lead email",
      bindValue: "projectLeadEmail",
      placeHolder: "example@example.com",
      wrong: false,
      required: true,
    },
    {
      type: "text",
      title: "Country of Residence",
      bindValue: "countryOfResidence",
      placeHolder: "USA",
      wrong: false,
      required: true,
    },
    {
      type: "text",
      title: "Team Website",
      bindValue: "teamWebsite",
      placeHolder: "URL",
      wrong: false,
    },
    {
      type: "text",
      title: "Twitter Website",
      bindValue: "twitterLink",
      placeHolder: "URL",
      wrong: false,
    },
    {
      type: "text",
      title: "Discord Website",
      bindValue: "discordLink",
      placeHolder: "URL",
      wrong: false,
    },
  ];

export const fieldsPart1 = [
    {
      type: "largeText",
      title: "Core Team",
      bindValue: "coreTeam",
      rows: 15,
      placeHolder: `John Doe
Role: developer, UX/UI designer
Relevant Credentials (e.g.):
GitHub: https://github.com/johndoe
LinkedIn: https://linkedin.com/in/johndoe
Background/Experience:
Co-founder at xxx`,
    },
    {
      type: "largeText",
      title: "Advisors",
      bindValue: "advisors",
      rows: 15,
      placeHolder: `For each Advisor, give their name, role and background. Use the same format as in "Core Team"`,
    },
  ];

export const validationSchema= yup.object().shape({
    projectName: yup.string().required("Project name is required"),
    projectCategory: yup.string().required("Project category is required"),
    projectDescription: yup.string().required("Project description is required"),
    finalProduct: yup.string().required("Final product description is required"),
    projectLeadFullName: yup.string().required("Project lead name is required"),
    projectLeadEmail: yup.string().required("Project lead email is required").email('Invalid email format'),
    countryOfResidence: yup.string().required("Country of residience is required").max(30),
    teamWebsite: yup.string().test('teamWebsite', 'The provided url is not valid', function(value){
        if (value) {
            const schema = yup.string().matches(
                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                'The provided url is not valid'
            )
            return schema.isValidSync(value);
          }
        return true;

    }),
    twitterLink: yup.string().test('twitterLink', 'The provided url is not valid', function(value){
        if (value) {
            const schema = yup.string().matches(
                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                'The provided url is not valid'
            )
            return schema.isValidSync(value);
          }
        return true;

    }),
    discordLink: yup.string().test('discordLink', 'The provided url is not valid', function(value){
        if (value) {
            const schema = yup.string().matches(
                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                'The provided url is not valid'
            )
            return schema.isValidSync(value);
          }
        return true;

    }),     
    coreTeam: yup.string(),
    advisors: yup.string()
})

export const initialValues= {
    projectName: "", 
    projectCategory: "",
    projectDescription: "", 
    finalProduct: "",
    projectLeadFullName: "", 
    projectLeadEmail: "",
    countryOfResidence: "", 
    teamWebsite: "",
    twitterLink: "", 
    discordLink: "",
    coreTeam: "",
    advisors: ""
  }