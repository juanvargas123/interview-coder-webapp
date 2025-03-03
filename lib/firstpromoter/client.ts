import axios from 'axios';

// First Promoter cookie name (this should match what First Promoter uses)
export const FP_COOKIE_NAME = '_fprom_tid';

// This file is kept for reference but most functionality is now handled by First Promoter's script
// We're letting First Promoter handle cookie setting and conversion tracking automatically

// Function to track a conversion with First Promoter API (if needed for custom tracking)
export const trackConversion = async ({
  email,
  amount,
  transactionId,
  referralCode
}: {
  email: string;
  amount: number;
  transactionId: string;
  referralCode: string;
}) => {
  if (!process.env.FIRST_PROMOTER_API_KEY) {
    console.error('Missing FIRST_PROMOTER_API_KEY environment variable');
    return null;
  }

  try {
    const response = await axios.post(
      'https://firstpromoter.com/api/v1/track/conversion',
      {
        email,
        amount, // Amount in cents
        transaction_id: transactionId,
        referral_code: referralCode,
        commission_type: 'percentage',
        commission_value: 50, // 50% commission
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.FIRST_PROMOTER_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error tracking First Promoter conversion:', error);
    return null;
  }
};

// Function to extract referral code from cookies
export const getReferralCodeFromCookies = (cookies: { get: (name: string) => { value: string } | undefined }) => {
  const fpCookie = cookies.get(FP_COOKIE_NAME);
  return fpCookie?.value || null;
}; 