const nodemailer = require('nodemailer');


jest.mock('nodemailer');
const mockSendMail = jest.fn();

nodemailer.createTransport.mockReturnValue({
    sendMail: mockSendMail
});

const { sendRegistrationSuccessMail } = require('../../src/utils/mailer');

describe('sendRegistrationSuccessMail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SENDER_EMAIL = 'testsender@example.com';
        process.env.SENDER_PASSWORD = 'testpassword';
    });

    it('should send an email successfully', async () => {
        mockSendMail.mockResolvedValue({ messageId: '12345' });

        const recipientEmail = 'recipient@example.com';
        const eventDetails = { name: 'Test Event' };

        await sendRegistrationSuccessMail(recipientEmail, eventDetails);

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: 'gmail',
            auth: {
                user: 'testsender@example.com',
                pass: 'testpassword',
            },
        });

        expect(mockSendMail).toHaveBeenCalledWith({
            from: 'testsender@example.com',
            to: recipientEmail,
            subject: 'Registration successful for Test Event',
            text: 'Hello! You have successfully registered for the event "Test Event".',
            html: '<h1>Hello!</h1><p>You have successfully registered for the event "Test Event".</p>',
        });
    });

    it('should log an error if sending fails', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockSendMail.mockRejectedValue(new Error('Failed to send'));

        await sendRegistrationSuccessMail('fail@example.com', { name: 'Fail Event' });

        expect(consoleSpy).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
        consoleSpy.mockRestore();
    });

});
