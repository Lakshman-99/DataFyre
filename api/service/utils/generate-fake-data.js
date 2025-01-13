import { faker } from '@faker-js/faker';

// Data structure representing the parent-child hierarchy
const fakerModules = {
    Faker: ['constructor', 'getMetadata', 'seed', 'setDefaultRefDate'],
    SimpleFaker: ['constructor', 'seed', 'setDefaultRefDate'],
    Randomizer: ['next', 'seed'],
    Utilities: ['generateMersenne32Randomizer', 'generateMersenne53Randomizer', 'mergeLocales'],
    Airline: ['aircraftType', 'airline', 'airplane', 'airport', 'flightNumber', 'recordLocator', 'seat'],
    Animal: ['bear', 'bird', 'cat', 'cetacean', 'cow', 'crocodilia', 'dog', 'fish', 'horse', 'insect', 'lion', 'petName', 'rabbit', 'rodent', 'snake', 'type'],
    Book: ['author', 'format', 'genre', 'publisher', 'series', 'title'],
    Color: ['cmyk', 'colorByCSSColorSpace', 'cssSupportedFunction', 'cssSupportedSpace', 'hsl', 'human', 'hwb', 'lab', 'lch', 'rgb', 'space'],
    Commerce: ['department', 'isbn', 'price', 'product', 'productAdjective', 'productDescription', 'productMaterial', 'productName'],
    Company: ['buzzAdjective', 'buzzNoun', 'buzzPhrase', 'buzzVerb', 'catchPhrase', 'catchPhraseAdjective', 'catchPhraseDescriptor', 'catchPhraseNoun', 'name'],
    Database: ['collation', 'column', 'engine', 'mongodbObjectId', 'type'],
    Datatype: ['boolean'],
    Date: ['anytime', 'between', 'betweens', 'birthdate', 'future', 'month', 'past', 'recent', 'soon', 'timeZone', 'weekday'],
    Finance: ['accountName', 'accountNumber', 'amount', 'bic', 'bitcoinAddress', 'creditCardCVV', 'creditCardIssuer', 'creditCardNumber', 'currency', 'currencyCode', 'currencyName', 'currencySymbol', 'ethereumAddress', 'iban', 'litecoinAddress', 'maskedNumber', 'pin', 'routingNumber', 'transactionDescription', 'transactionType'],
    Food: ['adjective', 'description', 'dish', 'ethnicCategory', 'fruit', 'ingredient', 'meat', 'spice', 'vegetable'],
    Git: ['branch', 'commitDate', 'commitEntry', 'commitMessage', 'commitSha'],
    Hacker: ['abbreviation', 'adjective', 'ingverb', 'noun', 'phrase', 'verb'],
    Helpers: ['arrayElement', 'arrayElements', 'enumValue', 'fake', 'fromRegExp', 'maybe', 'multiple', 'mustache', 'objectEntry', 'objectKey', 'objectValue', 'rangeToNumber', 'replaceCreditCardSymbols', 'replaceSymbols', 'shuffle', 'slugify', 'uniqueArray', 'weightedArrayElement'],
    Image: ['avatar', 'avatarGitHub', 'avatarLegacy', 'dataUri', 'url', 'urlLoremFlickr', 'urlPicsumPhotos', 'urlPlaceholder'],
    Internet: ['color', 'displayName', 'domainName', 'domainSuffix', 'domainWord', 'email', 'emoji', 'exampleEmail', 'httpMethod', 'httpStatusCode', 'ip', 'ipv4', 'ipv6', 'jwt', 'jwtAlgorithm', 'mac', 'password', 'port', 'protocol', 'url', 'userAgent', 'username', 'userName'],
    Location: ['buildingNumber', 'cardinalDirection', 'city', 'continent', 'country', 'countryCode', 'county', 'direction', 'latitude', 'longitude', 'nearbyGPSCoordinate', 'ordinalDirection', 'secondaryAddress', 'state', 'street', 'streetAddress', 'timeZone', 'zipCode'],
    Lorem: ['lines', 'paragraph', 'paragraphs', 'sentence', 'sentences', 'slug', 'text', 'word', 'words'],
    Music: ['album', 'artist', 'genre', 'songName'],
    Number: ['bigInt', 'binary', 'float', 'hex', 'int', 'octal', 'romanNumeral'],
    Person: ['bio', 'firstName', 'fullName', 'gender', 'jobArea', 'jobDescriptor', 'jobTitle', 'jobType', 'lastName', 'middleName', 'prefix', 'sex', 'sexType', 'suffix', 'zodiacSign'],
    Phone: ['imei', 'number'],
    Science: ['chemicalElement', 'unit'],
    String: ['alpha', 'alphanumeric', 'binary', 'fromCharacters', 'hexadecimal', 'nanoid', 'numeric', 'octal', 'sample', 'symbol', 'ulid', 'uuid'],
    System: ['commonFileExt', 'commonFileName', 'commonFileType', 'cron', 'directoryPath', 'fileExt', 'fileName', 'filePath', 'fileType', 'mimeType', 'networkInterface', 'semver'],
    Vehicle: ['bicycle', 'color', 'fuel', 'manufacturer', 'model', 'type', 'vehicle', 'vin', 'vrm'],
    Word: ['adjective', 'adverb', 'conjunction', 'interjection', 'noun', 'preposition', 'sample', 'verb', 'words']
};

// Function to execute faker method dynamically
const executeFakerMethod = (methodName) => {
    // Find the module that contains the method
    for (const moduleName in fakerModules) {
        if (fakerModules[moduleName].includes(methodName)) {
            const module = moduleName.toLowerCase();
            const method = methodName;

            // Check if the method exists in Faker
            if (faker[module] && typeof faker[module][method] === "function") {
                return faker[module][method](); // Execute the method
            }
        }
    }

    return methodName;
};

// Function to parse and generate mock data based on inputJson
const generateFakeData = (inputJson, language = "en") => {
    // Set the Faker locale/language
    faker.locale = language;

    const parseValue = (value) => {
        if (typeof value === "string") {
            // Handle faker.module_name
            if (value.startsWith("faker.")) {
                const methodName = value.split(".")[1]; // Extract the method name
                return executeFakerMethod(methodName);
            }

            // Handle `|` for random selection
            if (value.includes("|")) {
                const options = value.split("|").map((item) => item.trim());
                return faker.helpers.arrayElement(options);
            }

            // Handle patterns with `#`, `?`, `*`
            if (/[#?*]/.test(value)) {
                return faker.helpers.replaceSymbols(value);
            }

            return value;
        }

        if (Array.isArray(value)) {
            return value.map(parseValue);
        }

        if (typeof value === "object" && value !== null) {
            return parseObject(value);
        }

        return value;
    };

    // Function to parse object recursively
    const parseObject = (obj) => {
        const result = {};

        for (const key in obj) {
            if (key.endsWith(".length") && Array.isArray(obj[key.replace(".length", "")])) {
                const arrayKey = key.replace(".length", "");
                const length = obj[key];
                const template = obj[arrayKey][0];

                result[arrayKey] = Array.from({ length }, () => parseObject(template));
            } else if (!key.endsWith(".length") && !(Array.isArray(obj[key]) && key + ".length" in obj)) {
                result[key] = parseValue(obj[key]);
            }
        }

        return result;
    };

    return parseObject(inputJson);
};

export default generateFakeData;