async function sendLeadNotification(submission) {
  if (process.env.SIDE_EFFECT_FAIL === "true") {
    throw new Error("Simulated side-effect failure");
  }
  console.log("[notification]", {
    submissionId: submission.id,
    widgetId: submission.widgetId
  });
}
module.exports = { sendLeadNotification };
