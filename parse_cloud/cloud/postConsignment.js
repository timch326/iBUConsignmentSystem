var _ = require('cloud/lib/underscore.js');

Parse.Cloud.define('postConsignment', function (request, response) {

  Parse.Cloud.useMasterKey();

  var errors = findConsignmentErrors(request.params);
  if (errors.length) {
    response.error(errors);
  }

  var consignment = {};

  createConsignorIfNotExists(request.params)
    .then(function (consignor) {
      consignment = consignor.toJSON();
      return createConsignmentItems(request.params, consignor);
    })
    .then(function () {
      consignment.consignmentItems = arguments;
      response.success(consignment);
    },
    response.error);
});

function createConsignorIfNotExists(consignorInfo) {
  return getConsignor(consignorInfo.studentId)
    .then(
    function (consignor) {
      if (!consignor.length) {
        consignor = new Parse.Object('Consignor');
        return consignor.save({
          studentId: consignorInfo.studentId,
          firstName: consignorInfo.firstName,
          lastName: consignorInfo.lastName,
          email: consignorInfo.email,
          phoneNumber: consignorInfo.phoneNumber,
          faculty: consignorInfo.faculty
        });
      } else {
        return consignor[0];
      }
    }
  );
}

function getConsignor(studentId) {
  var consignorQuery = new Parse.Query('Consignor');
  return consignorQuery
    .equalTo('studentId', studentId)
    .find();
}

// TODO: Support Packaged Books
function createConsignmentItems(consignorInfo, consignor) {
  return Parse.Promise.when(_.map(consignorInfo.books, function (bookInfo) {
    return createBookIfNotExists(bookInfo)
      .then(function (book) {
        return createConsignmentItem(bookInfo, consignor, [book]);
      });
  }));
}

function createBookIfNotExists(book) {
  return getBook(book.isbn)
    .then(function (result) {
      if (!result.length) {
        var newBook = new Parse.Object('Book');
        return newBook.save({
          isbn: book.isbn.toString(),
          title: book.title,
          author: book.author,
          edition: book.edition,
          courses: book.courses.join(',')
        });
      } else {
        return result[0];
      }
    });
}

function getBook(isbn) {
  var bookQuery = new Parse.Query('Book');
  return bookQuery
    .equalTo('isbn', isbn.toString())
    .find();
}

function createConsignmentItem(itemInfo, consignor, books) {
  var newItem = new Parse.Object('ConsignmentItem');
  return newItem.save({
    consignor: consignor,
    items: books,
    price: itemInfo.price,
    currentState: 'available'
  }).then(function (consignmentItem) {
    // Convert to JSON representation
    consignmentItem = consignmentItem.toJSON();
    var items = new Parse.Collection(books);
    consignmentItem.items = items.toJSON();
    return consignmentItem;
  });
}

// Validation
var consignorKeys = [
  'studentId',
  'firstName',
  'lastName',
  'email',
  'faculty'
];

var bookKeys = [
  'isbn',
  'title',
  'author',
  'edition',
  'courses'
];

function findConsignmentErrors(consignment) {
  var errors = [];

  // Check for required consignor fields fields
  var missingConsignorKeys = findMissingKeys(consignment, consignorKeys);
  if (missingConsignorKeys.length) {
    errors.push('Some consignor fields are missing: ' + missingConsignorKeys.join(', '));
  }
  if (!consignment.books.length) {
    errors.push('There are no items in the consignment.');
  } else {
    var missingBookKeys = _.reduce(consignment.books, function (missingKeys, book) {
      return _.union(missingKeys, findMissingKeys(book, bookKeys));
    });
    if (missingBookKeys.length) {
      errors.push('Some books are missing these fields: ' + missingBookKeys.join(', '));
    }
  }
  return errors;
}

function findMissingKeys(object, keys) {
  object = _.pick(object, _.identity);  // remove falsy properties
  return _.difference(keys, _.keys(object));
}