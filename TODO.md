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
- [ ] More error handling and meaningful error messages
- [X] Store each update on DB
- [X] Withdraw proposal
- [X] Proposal earmark handling
- [x] /proposal/update/ should only work until Proposal Deadline.
- [ ] do not allow updates in the proposal if proposal is withdrawn. (proposal updates and deliverables)

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
- [ ] Better handle errors(ex Create Project, Update Proposal when voting ended)
- [ ] Add spinners on buttons to update/create
- [x] Proposal Completion "Success" - Swal.Popup() flashes & goes away without user interaction. Looks broken.
- [ ] Include more information on Project and Proposal views
- [ ] Check if project has submitted deliverables if so, show a warning in complete proposal section
- [ ] Show a warning if the proposal is withdrawn.

### Future

- [ ] Final implementation for submit deliverables / complete proposal - A1 (verify on Berkay's PR)
- [ ] Earmarks will change - B1
- [ ] Withdraw proposal backend + UX/UI - B1
- [ ] /proposal/update/ view should not enable to submit if post Proposal Dedline - A2
- [ ] Upserting & completing old proposals. How: A different Discourse Category + link to original post vai Proposal URL.
-- Admin Panel - What's the lowest hanging fruit here. I.E. Gitcoin Django Admin panel.
- [ ] Proposal Page - Submit Deliverable - Update view so users are unable to submit more than once unless rejected. Reflect/Visualize current state & functionality. - A2
- [ ] Setup airtable w/ DISCORD_CATEGORY for each round
- [ ] Upserting & completing old proposals. How: A different Discourse Category + link to original post vai Proposal URL.
    - This impacts our Ops & automation.
- [ ] Add portUsername to project.model
- [ ] setup dev/prod environment configurations. Handle: SERVER_URI, DISCORD CATEGORY
- [ ] Earmarks will change - B1
- [ ] Update Withdrawn UX - Hide/Show button. Communicate state. - B1
- [ ] Add spinners on buttons to update/create - C1
- [ ] Admin panel: core-tech & deliverables -> Can we add a response field
