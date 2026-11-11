# AI recommendation implementation

Algorithm: item-item collaborative filtering on a binary order–product matrix.
Training builds learned cosine similarity weights from actual paid, completed
orders. Quantity is binary presence, so buying ten units does not count as ten
independent transactions. Cancelled and unpaid orders are excluded. No customer
names, phone numbers or addresses are included in the model.

For items a and b, similarity = co-purchase order count / sqrt(order count for
a × order count for b). Observed pairs are learned even with one co-purchase; training
requires at least three eligible orders. These are minimum safeguards, not an
accuracy guarantee. Model quality needs evaluation with a larger real dataset.

The learned model is saved atomically in the database. Failed training preserves
the previous model. Staff can train/retrain from the Recommendations page.
The training panel reports dataset size, training date and new orders.

The customer ranks candidate products by the sum of learned weights for cart
items, excludes cart items and unavailable products, and displays up to three.
When no eligible learned result exists, explicit staff mappings are used and
the customer heading reads Related Products rather than AI Recommendations.

Training is local PHP and requires no external AI provider, API key or Python
service. Tests train only on isolated fixtures; live orders are never fabricated.
The initial production database may have too little history to train. Build
genuine order history and retrain; do not present fallback suggestions as AI.

Method reference: Sarwar et al., Item-based collaborative filtering recommendation
algorithms (WWW 2001):
https://experts.umn.edu/en/publications/item-based-collaborative-filtering-recommendation-algorithms/

Routes: GET /api/staff/recommendation-model, POST
/api/staff/recommendation-model/train. Public product resources contain learned
scores and source labels, not the training orders or personal information.
