### Backend

- [x] Dockerize
- [x] Create project endpoint
- [x] Create proposal endpoint
- [x] Get proposals by project endpoint
- [x] Get projects by admin address endpoint
- [x] Signature verification
- [x] Airtable integration
- [x] Discourse api integration
- [X] Test airtable and discourse
- [x] DB Models and validations
- [x] Proposal update endpoint
- [x] Project update endpoint
- [ ] More error handling and meaningful error messages - A2
- [X] Store each update on DB
- [X] Withdraw proposal
- [X] Proposal earmark handling
- [x] /proposal/update/ should only work until Proposal Deadline.
- [X] do not allow updates in the proposal if proposal is withdrawn. (proposal updates and deliverables) - A2
- [x] Setup dev/prod environment configurations. Handle: SERVER_URI, DISCORD CATEGORY.

### Frontend

- [x] Web3 wallet connection
- [x] List created projects on frotend
- [x] Update Project page+router
- [x] List created proposals on frontend
- [x] Update Proposal page+router
- [x] Errors during 'Create Project" cause data to disappear.
- [x] Visualize "Proposal Deliverable Status" inside ProposalPage - B1
- [x] Add view for Proposal Rejection - rejectionDescription - B1
- [x] New discourse account. Prod is pointing to live airtable.
- [ ] Better handle errors(ex Create Project, Update Proposal when voting ended) - A2
- [x] Proposal Completion "Success" - Swal.Popup() flashes & goes away without user interaction. Looks broken.
- [ ] Include more information on Project and Proposal views - B1
- [ ] Check if project has submitted deliverables if so, show state of review. - B1 
- [ ] Show a warning if the proposal is withdrawn. - A2
- [ ] Admin panel: core-tech & deliverables -> Can we add a response field - B1

### Future
- [ ] /proposal/update/ should respect various rules such as deadlines. - A2
- [ ] Upserting & completing old proposals. How: A different Discourse Category + link to original post via Proposal URL. - A2
- Admin Panel - What's the lowest hanging fruit here - A2
- [ ] Wallet Address - Make UX contextual. "Not enough Ocean". Do not allow user to submit proposal. - A2
- [ ] Extremely basic home page dashboard - B1
- [ ] Proposal Page - Submit Deliverable - Update view so users are unable to submit more than once, and feedback is visible. - B1
- [ ] Setup airtable w/ DISCORD_CATEGORY for each round. Read this into existing fns. - B1
- [ ] Update Withdrawn UX - Hide/Show button. Communicate state. - B1
- [ ] Add spinners on buttons to update/create - C1
- [ ] Add portUsername to project.model. - C1
- [ ] // TODO - rejectProposalEarmark() - Use the right underlying earmark
- [ ] // TODO - Please fix. New projects can apply for coretech.
