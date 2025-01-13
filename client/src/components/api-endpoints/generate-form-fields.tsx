import { nanoid } from "@reduxjs/toolkit";
import { Divider, Form, Input, InputNumber, Typography } from "antd";
import React from "react";

const generateField = (fieldName: string, key: string, isArrayField: boolean) => {
    return (
        <Form.Item label={fieldName} name={isArrayField ? [0, fieldName] : fieldName} key={key} required>
            <Input placeholder="Enter a value" />
        </Form.Item>
    );
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateFormFields = (json: Record<string, any>, parentKey: string = "", isArrayField: boolean = false): JSX.Element[] => {
    const formFields: JSX.Element[] = [];
    for (const key in json) {
        const fieldType = typeof json[key];
        const fieldValue = json[key];

        if(fieldValue === null || key.endsWith(".length")) {
            continue;
        }

        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (fieldType === "string" || fieldType === "number" || fieldType === "boolean") {
            formFields.push(generateField(key, fullKey, isArrayField));
        }
        else if (Array.isArray(fieldValue)) {
            formFields.push((
                <React.Fragment key={key}>
                    <Typography.Title key={fullKey} level={5}>{key}</Typography.Title>
                    <Form.Item label="Array Length" name={`${key}.length`} key={nanoid()}>
                        <InputNumber 
                            min={1}
                            max={10}
                            value={1}
                            placeholder="Enter a number"
                        />
                    </Form.Item>
                        <Form.List name={isArrayField ? [0, key] : key}>
                            {() => (
                                <React.Fragment key={nanoid()}>
                                    {generateFormFields(fieldValue[0], fullKey, true)}
                                </React.Fragment>
                            )}
                        </Form.List>
                    <Divider />
                </React.Fragment>
            ));
        }
        else if (fieldType === "object") {
            formFields.push((
                <React.Fragment key={key}>
                    <Typography.Title key={fullKey} level={5}>{key}</Typography.Title>
                    <Form.List name={isArrayField ? [0, key] : key}>
                        {() => (
                            <React.Fragment key={nanoid()}>
                                {generateFormFields(fieldValue, fullKey, false)}
                            </React.Fragment>
                        )}
                    </Form.List>
                    <Divider />
                </React.Fragment>
            ));
        }
    }
    return formFields;
};

export const generateForm = (json: object): JSX.Element[] => {
    let formFields = [];
    if(Array.isArray(json)) {
        const firstObject = json[0];
        formFields.push(
            <Form.Item label="Array Length" name="Array Length" key="Array.Length">
                <InputNumber 
                    min={1}
                    max={10}
                    placeholder="Enter a number"
                />
            </Form.Item>
        );
        formFields = generateFormFields(firstObject, "", true);
    } else {
        formFields = generateFormFields(json);
    }
    return (
        formFields
    );
}