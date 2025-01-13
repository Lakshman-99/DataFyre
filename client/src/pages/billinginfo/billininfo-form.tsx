import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, notification, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';  // Import useTranslation hook
import { loadBillingInfo, addBillingInfo, updateBillingInfo, deleteBillingInfo } from '../../redux/billinginfo-slice'; // Import the actions
import { selectBillingInfo } from '../../redux/billinginfo-slice'; // Import the selector
import { AppState } from '../../redux/store';
import dayjs from 'dayjs';
import { BillingInfo } from '../../models/billinginfo';
import { updateBillingInfoById, createBillingInfo, getBillingInfo } from '../../services/billinginfo-service';
import { setLanguage } from "../../redux/language-slice";

// Ant Design Form Layout
const { Option } = Select;

const BillingInfoForm: React.FC<{ billingInfoId?: string }> = ({ billingInfoId }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const billingInfoList = useSelector((state: AppState) => state.billinginfo);
  const language = useSelector((state: AppState) => state.language.language);

  const changeLanguage = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  useEffect(() => {
    // Change language only if it's different from the current language
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]); // Also listen to location changes to trigger the effect on route change
  
  // Loading an existing BillingInfo if editing
  const currentBillingInfo = billingInfoId
    ? billingInfoList.find((billing) => billing._id === billingInfoId)
    : undefined;

  const [form] = Form.useForm();

  // Set the form values if editing
  useEffect(() => {
    if (currentBillingInfo) {
      form.setFieldsValue({
        payment_method: currentBillingInfo.payment_method,
        card_number: currentBillingInfo.card_number,
        card_holder_name: currentBillingInfo.card_holder_name,
        exp_date: currentBillingInfo.exp_date,
        primary: currentBillingInfo.primary,
        card_type: currentBillingInfo.card_type,
        billing_address: currentBillingInfo.billing_address,
        subscription_id: currentBillingInfo.subscription_id,
        subscription_start_date: dayjs(currentBillingInfo.subscription_start_date),
        subscription_end_date: dayjs(currentBillingInfo.subscription_end_date),
        amount: currentBillingInfo.amount,
        currency: currentBillingInfo.currency,
        payment_status: currentBillingInfo.payment_status,
        payment_method_token: currentBillingInfo.payment_method_token,
        transaction_history: currentBillingInfo.transaction_history,
        last_billed_at: dayjs(currentBillingInfo.last_billed_at),
      });
    }
  }, [billingInfoId, currentBillingInfo, form]);

  // Handle form submission (Create or Update)
  const handleSubmit = async (values: BillingInfo) => {
    let response;
    if (billingInfoId) {
      response = await updateBillingInfoById(billingInfoId, values);
      dispatch(updateBillingInfo(response));
      notification.success({
        message: t('createBillingInfo-component.billingInfoUpdated'),
        description: t('createBillingInfo-component.billingInfoUpdatedDesc'),
      });
    } else {
      response = await createBillingInfo(values);
      dispatch(addBillingInfo(response));
      notification.success({
        message: t('createBillingInfo-component.billingInfoCreated'),
        description: t('createBillingInfo-component.billingInfoCreatedDesc'),
      });
    }
     // If the current billing info is set as primary
     if (values.primary) {
      // Fetch all billing info for the user
      const allBillingInfo = await getBillingInfo();
      
      // Update other billing info to set primary to false
      for (const billingInfo of allBillingInfo) {
        if (billingInfo._id !== response._id && billingInfo.primary) {
          const updatedBillingInfo = await updateBillingInfoById(billingInfo._id, { ...billingInfo, primary: false });
          dispatch(updateBillingInfo(updatedBillingInfo));
        }
      }
    }
    form.resetFields();
  };

  return (
    <div>
      {/* <h2>{billingInfoId ? t('createBillingInfo-component.editBillingInfo') : t('createBillingInfo-component.addBillingInfo')}</h2> */}
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          payment_method: '',
          card_number: '',
          billing_address: '',
          subscription_id: '',
          subscription_start_date: dayjs(),
          subscription_end_date: dayjs(),
          amount: '',
          currency: 'USD',
          payment_status: 'pending',
          payment_method_token: '',
          transaction_history: '',
          last_billed_at: dayjs(),
        }}
      >
        <Form.Item label={t('createBillingInfo-component.paymentMethod')} name="payment_method" rules={[{ required: true ,message: t('add_billinginfo_component.payment_method_required') }]}>
          <Select placeholder={t('createBillingInfo-component.selectPaymentMethod')}>
            <Option value="credit_card">{t('createBillingInfo-component.creditCard')}</Option>
            <Option value="paypal">{t('createBillingInfo-component.paypal')}</Option>
            <Option value="bank_transfer">{t('createBillingInfo-component.bankTransfer')}</Option>
          </Select>
        </Form.Item>

        <Form.Item label={t('createBillingInfo-component.cardNumber')} name="card_number" rules={[{ required: true ,message: t('add_billinginfo_component.card_number_required') }, { 
      len: 19, // This checks if the length of the card number is exactly 16 characters
      message: t('createBillingInfo-component.cardNumberLengthError'),
    },]}>
          <Input placeholder={t('createBillingInfo-component.enterCardNumber')} />
        </Form.Item>

        <Form.Item label={t('createBillingInfo-component.cardHolderName')} name="card_holder_name" rules={[{ required: true, message: t('add_billinginfo_component.card_holdername_required') }]}>
          <Input placeholder={t('createBillingInfo-component.enterCardHolderName')} />
        </Form.Item>

        <Form.Item label={t('createBillingInfo-component.dateOfExpiry')} name="exp_date" rules={[{ required: true, message: t('add_billinginfo_component.dateofexpiry_required') }]}>
          <Input placeholder={t('createBillingInfo-component.enterDateOfExpiry')} />
        </Form.Item>

        <Form.Item label={t('createBillingInfo-component.cardType')} name="card_type" rules={[{ required: true , message: t('add_billinginfo_component.card_type_required')}]}>
          <Select placeholder={t('createBillingInfo-component.selectCardType')}>
            <Option value="MasterCard">Master Card</Option>
            <Option value="Paypal">PayPal</Option>
            <Option value="Visa">Visa</Option>
          </Select>
        </Form.Item>

        <Form.Item name="primary" valuePropName="checked">
        <Checkbox>{t('createBillingInfo-component.primary')}</Checkbox>
        </Form.Item>

        <Form.Item label={t('createBillingInfo-component.billingAddress')} name="billing_address" rules={[{ required: true, message: t('add_billinginfo_component.billing_address_required') }]}>
          <Input placeholder={t('createBillingInfo-component.enterBillingAddress')} />
        </Form.Item>

        <Form.Item label={t('createBillingInfo-component.amount')} name="amount" rules={[{ required: true, message: t('add_billinginfo_component.amount_required')},]}>
          <Input type="number" placeholder={t('createBillingInfo-component.enterAmount')} />
        </Form.Item>

        <Form.Item label={t('createBillingInfo-component.currency')} name="currency" rules={[{ required: true, message: t('add_billinginfo_component.currency_required') }]}>
          <Select placeholder={t('createBillingInfo-component.selectCurrency')}>
            <Option value="USD">USD</Option>
            <Option value="EUR">EUR</Option>
            <Option value="GBP">GBP</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            {billingInfoId ? t('createBillingInfo-component.updateBillingInfo') : t('createBillingInfo-component.createBillingInfo')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BillingInfoForm;