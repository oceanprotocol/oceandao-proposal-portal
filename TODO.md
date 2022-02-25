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

### Frontend
- [x] Web3 wallet connection
- [x] List created projects on frotend
- [x] Update Project page+router
- [x] List created proposals on frontend
- [x] Update Proposal page+router
- [x] Errors during 'Create Project" cause data to disappear.
- [x] Visualize "Proposal Deliverable Status" inside ProposalPage - B1
- [x] Add view for Proposal Rejection - rejectionDescription - B1
- [ ] Better handle errors(ex Create Project, Update Proposal when voting ended)
- [ ] Proposal Completion "Success" - Swal.Popup() flashes & goes away without user interaction. Remove or improve. Looks janky.

### Future 
- [ ] New proposal app -> discourse account.
- [ ] Upserting & completing old proposals. How: A different Discourse Category + link to original post vai Proposal URL.
    - This impacts our Ops & automation.
- [ ] Earmarks will change - B1
- [ ] Make "Withdraw Proposal" button contextual to state - B1
- [ ] Add spinners on buttons to update/create - C1
- [ ] Admin panel: core-tech & deliverables -> Can we add a response field
- [ ] Proposal Page - Submit Deliverable - Update view so users are unable to submit more than once unless rejected. Reflect/Visualize current state & functionality. - A2
