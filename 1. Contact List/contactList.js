const readline = require('readline');

let contacts = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const addContact = () => {
    rl.question('Name: ', (name) => {
        rl.question('Phone number: ', (phoneNumber) => {
            contacts.push({ name, phoneNumber });
            showMenu();
        });
    });
};

const viewAllContacts = () => {
    if (contacts.length > 0) {
        contacts.forEach((contact) => {
            console.log(
                `Name: ${contact.name}, Phone Number: ${contact.phoneNumber}`
            );
        });
    } else {
        console.log('No Contacts');
    }
    showMenu();
};

const searchContact = () => {
    rl.question(
        'Enter a name and search for the contact in the collection: ',
        (input) => {
            if (input.length > 0) {
                const findContact = contacts.find((contact) => {
                    const contactName = contact.name.toLowerCase().trim();
                    const inputName = input.toLowerCase().trim();
                    console.log('contactName: ', contactName);
                    console.log('inputName: ', inputName);

                    return contactName === inputName;
                });

                if (findContact === undefined) {
                    console.log('Contact was not found');
                } else {
                    console.log(findContact);
                }
            } else {
                console.log('Contact was not found');
            }
            showMenu();
        }
    );
};

const showMenu = () => {
    console.log('1. Add a contact');
    console.log('2. View all contacts');
    console.log('3. Search for a contact');
    console.log('4. Exit the application');

    rl.question('Choose a number: ', (input) => {
        switch (input) {
            case '1':
                addContact();
                break;
            case '2':
                viewAllContacts();
                break;
            case '3':
                searchContact();
                break;
            case '4':
                rl.close();
                break;

            default:
                console.log('Enter a valid number!');
                showMenu();
        }
    });
};

showMenu();
