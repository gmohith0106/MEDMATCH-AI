import { AgentService } from '../services/agent.service';

async function runAgentCli() {
  console.log('\n===============================================================');
  console.log('🤖 MEDMATCH AI — AUTONOMOUS PROCUREMENT AGENT PIPELINE');
  console.log('===============================================================\n');

  const agentService = new AgentService();
  console.log('Starting autonomous agent run for hospital-citycare-001 (Surgical Gloves SKU)...\n');

  const result = await agentService.executeAgentRun(
    'hospital-citycare-001',
    'cli-procurement-manager',
    'inv-gloves-001'
  );

  console.log(`✓ Run ID: ${result.run.id}`);
  console.log(`✓ Status: ${result.run.status}`);
  console.log('\nTimeline Steps:');
  result.steps.forEach((s) => {
    console.log(`  [${s.status === 'COMPLETED' ? '✓' : ' '}] Step ${s.stepNumber}: ${s.type}`);
  });

  if (result.recommendation) {
    console.log('\n===============================================================');
    console.log('📋 FINAL PROCUREMENT RECOMMENDATION:');
    console.log(`- Item:          ${result.recommendation.inventoryName}`);
    console.log(`- Top Supplier:  ${result.recommendation.supplierName}`);
    console.log(`- Quantity:      ${result.recommendation.quantity} units`);
    console.log(`- Unit Price:    $${result.recommendation.unitPrice.toFixed(2)}`);
    console.log(`- Total Cost:    $${result.recommendation.estimatedCost.toFixed(2)}`);
    console.log(`- Delivery Lead: ${result.recommendation.deliveryDays} days`);
    console.log(`- Status:        ${result.recommendation.status} (Human Approval Required)`);
    console.log(`- Reasoning:     ${result.recommendation.reasoning}`);
    console.log('===============================================================\n');
  }
}

runAgentCli().catch((err) => {
  console.error('Agent execution error:', err);
  process.exit(1);
});
