/**
 * Friendly names for the service names AWS uses in billing metrics, and what
 * each one is in this project. Unknown services fall back to AWS's own name.
 */
export const AWS_SERVICES: Record<string, { name: string; usedFor: string }> = {
  AmazonApiGateway: { name: "API Gateway", usedFor: "aws.juasoh.com: the form and inbox API" },
  AWSLambda: { name: "Lambda", usedFor: "Contact form and inbox functions" },
  AmazonDynamoDB: { name: "DynamoDB", usedFor: "Messages table and its backups" },
  AmazonSES: { name: "SES", usedFor: "Notification emails" },
  AmazonCognito: { name: "Cognito", usedFor: "Inbox login" },
  AmazonCloudWatch: { name: "CloudWatch", usedFor: "Logs, alarms and metrics" },
  AmazonSNS: { name: "SNS", usedFor: "Alert emails" },
  AWSXRay: { name: "X-Ray", usedFor: "Request tracing" },
  AmazonS3: { name: "S3", usedFor: "Terraform state bucket" },
  AWSCertificateManager: { name: "Certificate Manager", usedFor: "HTTPS certificate" },
  awskms: { name: "KMS", usedFor: "Encryption keys" },
  AWSDataTransfer: { name: "Data transfer", usedFor: "Traffic out of AWS" },
  AWSCloudTrail: { name: "CloudTrail", usedFor: "Account activity log" },
  AWSBudgets: { name: "Budgets", usedFor: "The monthly budget alert" },
  AWSCostExplorer: { name: "Cost Explorer", usedFor: "Cost reports" },
};

export const serviceInfo = (id: string) => AWS_SERVICES[id] ?? { name: id, usedFor: "" };
