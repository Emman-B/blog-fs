-- Dummy Users Data
INSERT INTO users (username, email, password) VALUES (
    'johndoe',
    'johndoe@example.com',
    '$2b$10$OUesvhrnM3kH4qVYNuY4QOSELhTFgRdgy63/kzlpUGj2/Idfsii2C'
);
INSERT INTO users (username, email, password) VALUES (
    'janedoe',
    'janedoe@example.com',
    '$2b$10$nbARN2QvcMwOoEokYOOvI.XO/7qDSgrOJN36PwZQr/6V56IbuH/ei'
);
INSERT INTO users (username, email, password) VALUES (
    'irwinjones',
    'irwinjones@example.com',
    '$2b$10$440PvzA8ugpDBcixZEnCl.HE.PpayjsOMLaW..jlUZcMaAydKIKIW'
);


-- Dummy Blogpost Data
INSERT INTO blogposts (author, title, permissions, publishdate, updateddate, content) VALUES (
    'johndoe',
    'About my day',
    'public',
    '2016-10-30T00:59:50Z',
    '2019-09-11T03:43:15Z',
    '<h2>Lorem ipsum dolor sit amet</h2>, consectetur adipiscing elit. Nam eleifend, ante ut euismod dignissim, nunc erat semper erat, quis semper neque tellus mattis enim. Vivamus et finibus ante, non eleifend tortor. Maecenas ut eros turpis. Maecenas dolor mi, fermentum sed dictum ac, imperdiet et turpis. Quisque sit amet scelerisque felis. In quis metus hendrerit, rutrum orci ut, aliquam turpis. Morbi eget leo efficitur, aliquet ipsum eget, finibus nibh. Vivamus porttitor convallis diam in tempus. Aliquam sagittis egestas sagittis. Etiam erat nulla, tempus eu est eu, semper rhoncus nisi. Fusce facilisis, arcu eu blandit egestas, lectus justo mattis libero, in pellentesque urna magna id enim. Nullam quis diam euismod nunc fermentum imperdiet eget non urna. Nullam quis dui arcu. In hac habitasse platea dictumst. Quisque eros sem, maximus non nibh quis, blandit dictum tortor. Curabitur quis dolor nec tortor rutrum commodo eget non metus.'
);

INSERT INTO blogposts (author, title, permissions, publishdate, updateddate, content) VALUES (
    'johndoe',
    'Another post about my day',
    'public',
    '2018-07-29T01:46:39Z',
    '2018-07-29T01:46:39Z',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus, orci id malesuada viverra, ante tortor eleifend sem, vitae molestie nisl velit a dolor. Quisque nec ex arcu. Duis id faucibus felis. Etiam tristique, felis in pharetra iaculis, dui justo aliquam libero, et bibendum ex mauris quis diam. Aliquam in orci est. Duis maximus mi nunc, id consequat lacus lobortis non. Fusce lacus metus, aliquet consectetur dolor ac, condimentum sagittis libero. Phasellus sodales vitae mauris eget placerat. Morbi tortor est, mollis sit amet enim quis, ornare porttitor magna. Quisque nec tempus felis. Nulla in facilisis nisi. Aliquam egestas tellus erat, ac porta enim placerat quis. Morbi ullamcorper quis enim congue tincidunt. Nunc eu tempor lectus, vel facilisis neque.'
);

INSERT INTO blogposts (author, title, permissions, publishdate, updateddate, content) VALUES (
    'janedoe',
    'Topics of conversation',
    'public',
    '2016-05-22T04:32:34Z',
    '2020-08-26T07:48:02Z',
    '<h1>Lorem ipsum dolor sit amet</h1>, consectetur adipiscing elit. Cras consectetur, lectus ac ullamcorper tincidunt, quam mauris finibus nibh, ac gravida ligula dui sed quam. Donec placerat massa sit amet sollicitudin blandit. Maecenas pretium dapibus sollicitudin. Vivamus a risus sed turpis egestas facilisis eget at leo. Nam pulvinar ornare vehicula. Duis nulla magna, suscipit ac pellentesque eget, varius id erat. Morbi pellentesque massa at dui dignissim bibendum. Integer hendrerit mauris ac lobortis pellentesque. Curabitur fermentum dolor vitae nisi vulputate suscipit. Suspendisse dui libero, placerat sed tortor ac, faucibus ornare lorem.'
);

INSERT INTO blogposts (author, title, permissions, publishdate, updateddate, content) VALUES (
    'irwinjones',
    'Private post only available to me',
    'private',
    '2018-04-21T01:46:39Z',
    '2019-07-29T01:46:39Z',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus, orci id malesuada viverra, ante tortor eleifend sem, vitae molestie nisl velit a dolor. Quisque nec ex arcu. Duis id faucibus felis. Etiam tristique, felis in pharetra iaculis, dui justo aliquam libero, et bibendum ex mauris quis diam. Aliquam in orci est. Duis maximus mi nunc, id consequat lacus lobortis non. Fusce lacus metus, aliquet consectetur dolor ac, condimentum sagittis libero. Phasellus sodales vitae mauris eget placerat. Morbi tortor est, mollis sit amet enim quis, ornare porttitor magna. Quisque nec tempus felis. Nulla in facilisis nisi. Aliquam egestas tellus erat, ac porta enim placerat quis. Morbi ullamcorper quis enim congue tincidunt. Nunc eu tempor lectus, vel facilisis neque.'
);

INSERT INTO blogposts (author, title, permissions, publishdate, updateddate, content) VALUES (
    'irwinjones',
    'Post available to all users',
    'users',
    '2017-02-22T04:32:34Z',
    '2019-08-26T07:48:02Z',
    '<h1>Lorem ipsum dolor sit amet</h1>, consectetur adipiscing elit. Cras consectetur, lectus ac ullamcorper tincidunt, quam mauris finibus nibh, ac gravida ligula dui sed quam. Donec placerat massa sit amet sollicitudin blandit. Maecenas pretium dapibus sollicitudin. Vivamus a risus sed turpis egestas facilisis eget at leo. Nam pulvinar ornare vehicula. Duis nulla magna, suscipit ac pellentesque eget, varius id erat. Morbi pellentesque massa at dui dignissim bibendum. Integer hendrerit mauris ac lobortis pellentesque. Curabitur fermentum dolor vitae nisi vulputate suscipit. Suspendisse dui libero, placerat sed tortor ac, faucibus ornare lorem.'
);

INSERT INTO blogposts (author, title, permissions, publishdate, updateddate, content) VALUES (
    'irwinjones',
    'Post available to those with a link',
    'unlisted',
    '2017-02-22T04:32:34Z',
    '2019-08-26T07:48:02Z',
    '<h1>Lorem ipsum dolor sit amet</h1>, consectetur adipiscing elit. Cras consectetur, lectus ac ullamcorper tincidunt, quam mauris finibus nibh, ac gravida ligula dui sed quam. Donec placerat massa sit amet sollicitudin blandit. Maecenas pretium dapibus sollicitudin. Vivamus a risus sed turpis egestas facilisis eget at leo. Nam pulvinar ornare vehicula. Duis nulla magna, suscipit ac pellentesque eget, varius id erat. Morbi pellentesque massa at dui dignissim bibendum. Integer hendrerit mauris ac lobortis pellentesque. Curabitur fermentum dolor vitae nisi vulputate suscipit. Suspendisse dui libero, placerat sed tortor ac, faucibus ornare lorem.'
);
