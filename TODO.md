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

### Frontend
- [x] Web3 wallet connection
- [x] List created projects on frotend
- [x] Update Project page+router
- [x] List created proposals on frontend
- [x] Update Proposal page+router
- [x] Errors during 'Create Project" cause data to disappear.
- [ ] Better handle errors(ex Create Project, Update Proposal when voting ended)
- [ ] Add spinners on buttons to update/create
- [ ] Proposal Completion "Success" - Swal.Popup() flashes & goes away without user interaction. Looks broken.

### Future
- [ ] Final implementation for submit deliverables / complete proposal - A1 (verify on Berkay's PR)
- [ ] Update Proposal should only be enabled until Proposal Deadline. - A2
- [ ] Earmarks will change - B1
- [ ] Withdraw proposal backend + UX/UI
- [ ] Upserting & completing old proposals. How: A different Discourse Category + link to original post vai Proposal URL.

-- Admin Panel - What's the lowest hanging fruit here. I.E. Gitcoin Django Admin panel.
- [ ] Admin panel: core-tech & deliverables -> Can we respond w/ a reason?
- [ ] Visualize the admin stages: "Submit Proposal Deliverables" => "Verifying Proposal Deliverables" (Yellow) => "Accepted Proposal Deliverables" (Green) => "Rejected Proposal Deliverables" (Red)  
- [ ] Visualize rejection reason (or respond directly in Discourse)
