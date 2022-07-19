const { hasProposalReceivedMoreThanAllowedTotalFunding } = require("../utils/airtable/utils")

test('Project should not exceed the total funding allowed amount', async() => {
    const totalFundingAllowedAmount = 100000
    const projectName = "DataX"
    const currentFundingRequested = 10000
    const hasProposalTotalFundingExceededAllowedAmount = await hasProposalReceivedMoreThanAllowedTotalFunding(totalFundingAllowedAmount, projectName, currentFundingRequested)
    expect(hasProposalTotalFundingExceededAllowedAmount).toBe(false);
});

test('Project should exceed the total funding allowed amount', async() => {
    const totalFundingAllowedAmount = 50000
    const projectName = "DataX"
    const currentFundingRequested = 10000
    const hasProposalTotalFundingExceededAllowedAmount = await hasProposalReceivedMoreThanAllowedTotalFunding(totalFundingAllowedAmount, projectName, currentFundingRequested)
    expect(hasProposalTotalFundingExceededAllowedAmount).toBe(true);
});

test('Return false if project name does not exist', async() => {
    const totalFundingAllowedAmount = 50000
    const projectName = "asdfghj"
    const currentFundingRequested = 10000
    const hasProposalTotalFundingExceededAllowedAmount = await hasProposalReceivedMoreThanAllowedTotalFunding(totalFundingAllowedAmount, projectName, currentFundingRequested)
    expect(hasProposalTotalFundingExceededAllowedAmount).toBe(false);
});
