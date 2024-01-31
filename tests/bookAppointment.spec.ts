import { test, expect, Page } from '@playwright/test';
import { createPatient } from './testGenerator';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        //base URL?
        await page.goto('/');
    });

    test('Booking an Appointment', async ({ page }) => {
        const { birthDay, firstName, lastName, emailAddress, address, city } = createPatient();
        await expect(page.getByText('Schedule your Appointment!')).toBeVisible();
        await page.getByTestId('california').click();

        await page.locator('div:nth-child(1) > div:nth-child(2) > button:nth-child(2)').click();
        //this makes sure im always grabbing the first available appt slot5
        await page.getByTestId('appointmentOverviewContinue').click();

        await page.getByPlaceholder('Jane').nth(0).fill(firstName);
        await page.getByPlaceholder('Doe').nth(0).fill(lastName);
        await page.getByTestId('verifyEmail').fill(emailAddress);
        await page.getByPlaceholder('jane@doe.com').fill(emailAddress);
        await page.getByTestId('verifyEmail').fill(emailAddress);
        await page.getByPlaceholder('mm/dd/yyyy').fill(birthDay);
        await page.getByPlaceholder('(201) 555-5555').fill('(201) 555-5555');
        const sexDropDown = page.getByTestId('sex');
        await sexDropDown.selectOption('Male');
        const pronounDropDown = page.getByTestId('preferredPronouns');
        await pronounDropDown.selectOption('she/her');
        await page.getByTestId('tosConsent').click();
        await page.getByTestId('marketingConsent').click();
        await page.getByTestId('contactDetailsContinue').click();
        await page.getByTestId('addressLine1').fill(address);
        await page.getByTestId('city').fill(city);
        await page.getByTestId('zip').fill("12345");
        await page.getByTestId('shippingAddressContinue').click();
        await expect(page.getByText('Payment Method')).toBeVisible();

    });
    test('Booking an Appointment For Underage Patient', async ({ page }) => {
        const { childBirthDay, firstName, lastName, emailAddress, address, city } = createPatient();
        await expect(page.getByText('Schedule your Appointment!')).toBeVisible();
        await page.getByTestId('colorado').click();

        await page.locator('div:nth-child(1) > div:nth-child(2) > button:nth-child(2)').click();
        await page.getByTestId('appointmentOverviewContinue').click();

        await page.getByPlaceholder('Jane').nth(0).fill(firstName);
        await page.getByPlaceholder('Doe').nth(0).fill(lastName);
        await page.getByTestId('verifyEmail').fill(emailAddress);
        await page.getByPlaceholder('jane@doe.com').fill(emailAddress);
        await page.getByTestId('verifyEmail').fill(emailAddress);
        await page.getByPlaceholder('mm/dd/yyyy').fill(childBirthDay);
        await page.getByPlaceholder('(201) 555-5555').fill('(201) 555-5555');
        const sexDropDown = page.getByTestId('sex');
        await sexDropDown.selectOption('Male');
        const pronounDropDown = page.getByTestId('preferredPronouns');
        await pronounDropDown.selectOption('she/her');
        await page.getByTestId('tosConsent').click();
        await page.getByTestId('marketingConsent').click();
        await expect(page.getByText('Unfortunately, this treatment is only available for patients older than 18 years of age')).toBeVisible();


    });

    test('Fail Case for Booking in Unavailable Location', async ({ page }) => {
        await expect(page.getByText('Schedule your Appointment!')).toBeVisible();
        await page.getByTestId('otherstate').click();
        await page.getByPlaceholder('Type or select an option').fill("New York");
        await page.getByText('New York').nth(0).click();
        await expect(page.getByText('Sorry, we do not support your state at this time')).toBeVisible();

    });


});