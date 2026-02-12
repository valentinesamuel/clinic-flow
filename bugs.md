- when editing a claim, i should be able to add an ICD-10 code, and in the claim details view, the pre auth code should also be show
- we should also note that multiple bills can now be linked to a claim, so in the claim details view, we should show all line items grouped by bills and their details. We should also have a link which we can click to view that bill in detail (including total amount) instead of just one bill
- in the claim details view, the attachments should also be shown in a seperate section and we can click on them to view the full image/pdf in preview mode
- when reubmitting a rejected claim, i should be able to add an ICD-10 code,
- on the episode detail page, for the items in bill, consults, lab, pharmacy nad claims, we should show the total amount for each item and not just the price/amount of the service. and we should also show a link that would take us to the entity detail page which can be the details page of bill, consultation, lab test, etc.
- on the episode detail page, we also want to see the various diagnosis that have has been added.
- on thye episodes table, there is no need to show the items column
- in the consultation detail page, when we select an ICD code and we get the bundle. By the time that bundle is applied, we should not automatically check the medications because the test needs to come back before we can prescribe drugs
- when a doctor clicks on the see button from the consultation table, it should show a confirmation modal to make the doctor understand that he is about to start the consultation. if he proceeds, it should automatically start hte consultaion and redirect to the consultation detail page.

NOTE: We also have to make sure that all inputs and interactions are dynamic even if we are using dummy data. E.g we should he able to add to lists, search lists, filter, validate input data etc. and make it seem like there is at lease basic integration with a backend