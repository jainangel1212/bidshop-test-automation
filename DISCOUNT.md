# Bonus Task – 10% Order Discount

## Clarifying Questions

Before implementation, I would clarify:

- Is the 10% discount calculated on the subtotal before GST?
- Should the discount apply to all products, or are any products/categories excluded?
- Can this discount be combined with future promotions or discounts?
- How should fractional-cent values be rounded when calculating the discount, GST and final total?
- Should the discount be displayed separately in the cart, checkout and order confirmation?
- Should the order permanently store the discount amount so historical orders retain the calculation applied at purchase time?

## Proposed Changes

The exact implementation would depend on the agreed business rules, but I would expect changes in the following areas.

### API

- Add the discount calculation to the existing cart and order logic.
- If the subtotal is over NZD $100, calculate and apply the 10% discount.
- Return the discount amount in the relevant API response so it can be shown to the customer before the order is placed and on the final order.
- Update the final total based on the agreed discount and GST rules.
- Consider putting the discount behind a feature flag so it can be enabled or disabled without another deployment.

### UI

- Update the cart and checkout price summaries to show the discount when one has been applied.
- Update the displayed total to reflect the discounted amount.
- Show the applied discount on the order confirmation so the customer can understand the final price.

### Data Model

- Extend the order model to store the discount amount applied when the order was placed.
- If the application is expected to support additional promotions later, consider storing discount information such as the discount type or percentage.

## Test Strategy

I would focus on business-rule boundaries, calculation accuracy and the end-to-end customer journey.

### API Tests

Validate:

- Subtotal of NZD $99.99 – no discount.
- Subtotal of exactly NZD $100.00 – no discount.
- Subtotal of NZD $100.01 – 10% discount applied.
- Subtotal significantly over NZD $100 – correct discount applied.
- Multiple products whose combined subtotal crosses the threshold.
- Correct subtotal, discount, GST and final total calculations.
- Correct rounding where calculations result in fractional cents.
- Discount information is persisted and returned when retrieving an order.

### UI Tests

Validate:

- No discount is displayed when the order does not qualify.
- The discount appears when the threshold is crossed.
- The displayed discount and final total match the API calculation.
- The discount is displayed consistently through cart, checkout and order confirmation.

## Regression Validation

I would prioritise regression testing based on risk and impact:

- Run the P1/critical customer journeys including product catalogue, registration/login, add to cart, checkout and order placement.
- Run regression around the areas impacted by the change, particularly existing cart, pricing, GST and order calculations.
- Run the remaining regression tests based on available time and risk.

For the current Bidshop automation suite, I would run the full API and UI regression as the suite is small and quick to execute.

The new discount scenarios would also be added to the automated regression suite.

## Before Shipping

Before release I would want:

- How the discount, GST and final total should be calculated is confirmed.
- Acceptance criteria agreed.
- Automated discount scenarios passing.
- Existing API and UI regression suites passing.
- The complete cart-to-order customer journey verified.
- CI execution in place so the automated suites run consistently before release.
- If a feature flag is used, verify the discount behaviour with the flag both on and off.