import { faker } from '@faker-js/faker';
import { fakerModules } from '../components/api-endpoints/input-items';

// Type definitions
type FakerModuleName = keyof typeof faker; // Keys of Faker modules
type FakerMethodName<T extends FakerModuleName> = keyof typeof faker[T];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseAndGenerateMockData = (inputJson: Record<string, any>): Record<string, any> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const executeFakerMethod = (methodName: string): any => {
        // Find the module that contains the method
        for (const moduleName in fakerModules) {
            if (fakerModules[moduleName].includes(methodName)) {
                const module = moduleName.toLowerCase() as FakerModuleName;
                const method = methodName as FakerMethodName<typeof module>;

                // Check if the method exists in Faker
                if (faker[module] && typeof faker[module][method] === "function") {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                    return (faker[module][method] as Function)(); // Execute the method
                }
            }
        }
    
        return methodName;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseValue = (value: any): any => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseObject = (obj: Record<string, any>): Record<string, any> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: Record<string, any> = {};

        for (const key in obj) {
            if (key.endsWith(".length") && Array.isArray(obj[key.replace(".length", "")])) {
                const arrayKey = key.replace(".length", "");
                const length = obj[key];
                const template = obj[arrayKey][0];

                result[arrayKey] = Array.from({ length }, () => parseObject(template));
            } else if (!key.endsWith(".length") && !(Array.isArray(obj[key]) && key+".length" in obj )) {
                result[key] = parseValue(obj[key]);
            }
        }

        return result;
    };

    return parseObject(inputJson);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cleanJson = (obj: Record<string, any>): Record<string, any> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: Record<string, any> = {};

    for (const key in obj) {
        // If the current key ends with `.length`, skip it
        if (!key.endsWith(".length")) {
            // If the value is a nested object, apply recursion
            if (typeof obj[key] === "object" && !Array.isArray(obj[key]) && obj[key] !== null) {
                newObj[key] = cleanJson(obj[key]);
            } else {
                newObj[key] = obj[key]; // Copy the value as is
            }
        }
    }

    return newObj;
};