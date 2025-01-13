import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option, OptGroup } = Select;

interface FakerModules {
    [key: string]: string[];
}

// Data structure representing the parent-child hierarchy
export const fakerModules: FakerModules = {
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

// Convert fakerModules into options grouped alphabetically
const moduleGroups = Object.keys(fakerModules)
    .sort() // Alphabetical order
    .map(parent => (
        <OptGroup label={parent} key={parent}>
            {fakerModules[parent]
                .sort() // Alphabetical order for child options
                .map(child => (
                    <Option key={`${parent}-${child}`} value={`${parent}.${child}`}>
                        {child}
                    </Option>
                ))}
        </OptGroup>
    ));

export const FakerField = (): JSX.Element => {
    const { t } = useTranslation();
    return (
            <Select
                showSearch
                style={{ width: '100%' }}
                placeholder={t('faker.faker_placeholder')}
                optionFilterProp="children"
                filterOption={(input, option) => {
                    const children = option?.children as string | undefined;
                    return (
                        children?.toLowerCase().includes(input.toLowerCase()) ?? false
                    );
                }}
            >
                {moduleGroups}
            </Select>
    );
};