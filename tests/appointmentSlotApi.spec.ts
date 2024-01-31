import { test, expect, request } from '@playwright/test';
const payLoad = { "operationName": "cappedAvailableTimes", "variables": { "minimumDate": "2024-02-02T18:00:35.081Z", "maximumDate": "2024-02-13T18:00:35.081Z", "state": "colorado", "treatmentShortId": "weightloss" }, "query": "query cappedAvailableTimes($state: String!, $treatmentShortId: String!, $minimumDate: timestamptz!, $maximumDate: timestamptz!) {\n  cappedAvailableTimes: appointment_capped_available_appointment_slots(\n    where: {start_time: {_gt: $minimumDate, _lt: $maximumDate}, state: {_eq: $state}, treatment_object: {short_id: {_eq: $treatmentShortId}}, language: {_eq: \"en-US\"}, provider: {_and: {id: {_is_null: false}}}}\n    order_by: {start_time: asc}\n  ) {\n    ...CappedAvailableSlotsFragment\n    __typename\n  }\n}\n\nfragment CappedAvailableSlotsFragment on appointment_capped_available_appointment_slots {\n  startTime: start_time\n  endTime: end_time\n  provider {\n    id\n    displayName: display_name\n    __typename\n  }\n  __typename\n}" }

test('Requesting Appointment Times from GraphQL', async ({ request }) => {
    const response = await request.post("https://henry-prod.hasura.app/v1/graphql",
        {
            data: payLoad

        });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const cappedArrayLength = responseBody.data.cappedAvailableTimes.length;
    for (let i = 0; i < cappedArrayLength; i++) {
        expect(responseBody.data.cappedAvailableTimes[i]).toHaveProperty("startTime");
        expect(responseBody.data.cappedAvailableTimes[i]).toHaveProperty("endTime");
        expect(responseBody.data.cappedAvailableTimes[i].provider).toHaveProperty("id");
        expect(responseBody.data.cappedAvailableTimes[i].provider).toHaveProperty("displayName");
        expect(responseBody.data.cappedAvailableTimes[i].provider).toHaveProperty("__typename", "provider_provider");
        expect(responseBody.data.cappedAvailableTimes[i]).toHaveProperty("__typename", "appointment_capped_available_appointment_slots");

    }

});



