# Affiliate Tracking with First Promoter

This document outlines how affiliate tracking is implemented in the Interview Coder webapp using First Promoter.

## Overview

The system tracks affiliate referrals and awards a 50% commission to affiliates when users make a purchase through their referral link.

## How It Works

1. **Affiliate Link Format**: Affiliate links include a `fpr` parameter with the affiliate's unique code:
   ```
   https://interviewcoder.co/?fpr=AFFILIATE_CODE
   ```

2. **Tracking Script**: The First Promoter tracking script is added to the site's layout, which automatically handles most of the tracking functionality.

3. **Cookie Storage**: When a user visits the site through an affiliate link:
   - First Promoter's script automatically sets the `_fprom_tid` cookie
   - Our middleware also saves this as a fallback mechanism

4. **Checkout Process**: When a user makes a purchase, the `_fprom_tid` value from the cookie is included in the Stripe checkout session metadata as `fp_tid`.

5. **Conversion Tracking**: First Promoter automatically tracks conversions through its integration with Stripe, using the `fp_tid` value in the metadata.

## Implementation Details

### Files Involved

- `app/layout.tsx`: Contains the First Promoter tracking script
- `lib/firstpromoter/client.ts`: Utility functions for First Promoter integration
- `middleware.ts`: Handles saving the affiliate cookie from URL parameters
- `app/api/stripe/create-checkout/route.ts`: Passes affiliate information to Stripe

### Environment Variables

- `FIRST_PROMOTER_API_KEY`: Your First Promoter API key (required for API access if needed)

## Testing Affiliate Links

To test the affiliate tracking:

1. Open this link in an incognito window: `https://interviewcoder.co?fpr=test4z8yt1oa&test_mode=1`
2. Complete a purchase of at least $0.50 (you can use test mode or apply a coupon)
3. Wait 1-2 minutes for the sale to be processed
4. Return to the First Promoter dashboard and check if the conversion was tracked

## Troubleshooting

If affiliate tracking isn't working:

1. Check if the First Promoter script is loading properly in the browser
2. Verify the `_fprom_tid` cookie is being set when using an affiliate link
3. Check that the `fp_tid` value is being passed correctly to Stripe in the metadata
4. Verify the webhook events in Stripe and First Promoter

## First Promoter Dashboard

Access your First Promoter dashboard to:
- Manage affiliates
- View conversion data
- Configure commission rates
- Generate affiliate links 