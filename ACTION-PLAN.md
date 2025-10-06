# Anytool Paid Service - Action Plan

## The Pragmatic Path

1. Deploy
2. Dogfood in inbox.dog
3. Add billing
4. Sell to others

## Week-by-Week

### Week 1: Deploy & Dogfood

**Monday:**
- [ ] Deploy v2 to `anytool-api.coey.dev`
- [ ] Test with curl/Postman
- [ ] Verify all endpoints work

**Tuesday-Wednesday:**
- [ ] Add anytool client to inbox.dog
- [ ] Integrate first feature (pick easiest)
- [ ] Monitor for errors

**Thursday-Friday:**
- [ ] Add 2-3 more features
- [ ] Track usage metrics
- [ ] Note what works/breaks

**Weekend:**
- [ ] Review metrics
- [ ] Fix any issues
- [ ] Plan Week 2

### Week 2: Multi-tenant Auth

**Monday:**
- [ ] Add API key middleware
- [ ] Create KV namespace for keys
- [ ] Test with multiple keys

**Tuesday:**
- [ ] Add rate limiting (per key)
- [ ] Add usage tracking
- [ ] Basic admin endpoint (view usage)

**Wednesday:**
- [ ] User signup flow (simple form)
- [ ] Generate API keys on signup
- [ ] Email new users their key

**Thursday-Friday:**
- [ ] Dashboard to view usage
- [ ] Test with fake users
- [ ] Security audit

### Week 3: Billing

**Monday:**
- [ ] Stripe account setup
- [ ] Create products/prices
- [ ] Test webhook locally

**Tuesday:**
- [ ] Checkout flow
- [ ] Handle successful payment
- [ ] Upgrade user to paid

**Wednesday:**
- [ ] Usage-based limits
- [ ] Quota exceeded handling
- [ ] Upgrade prompts

**Thursday:**
- [ ] Pricing page
- [ ] Documentation
- [ ] Terms of service (use template)

**Friday:**
- [ ] End-to-end test
- [ ] Invite 3 friends to test
- [ ] Fix bugs

### Week 4: MCP Server

**Monday-Tuesday:**
- [ ] Build MCP server
- [ ] Test with Claude Desktop
- [ ] Package for npm

**Wednesday:**
- [ ] MCP documentation
- [ ] Installation guide
- [ ] Video walkthrough

**Thursday-Friday:**
- [ ] Polish everything
- [ ] Prepare launch materials
- [ ] Screenshot/video demos

### Week 5: Launch

**Monday:**
- [ ] Landing page final polish
- [ ] Docs final review
- [ ] Pricing finalized

**Tuesday:**
- [ ] Soft launch to email list
- [ ] Post in Indie Hackers
- [ ] Share on Twitter

**Wednesday:**
- [ ] Show HN post
- [ ] Monitor feedback
- [ ] Quick fixes

**Thursday-Friday:**
- [ ] Follow up with signups
- [ ] Answer questions
- [ ] Iterate based on feedback

## MVP Scope (What to Build First)

### Must Have
- ✅ API key authentication
- ✅ Rate limiting (100 req/hour free, 1000/hour paid)
- ✅ Stripe checkout
- ✅ Usage tracking
- ✅ Basic docs
- ✅ Pricing page

### Nice to Have (Later)
- ⏳ Dashboard with analytics
- ⏳ Webhook for usage alerts
- ⏳ Team accounts
- ⏳ Custom packages whitelist
- ⏳ SLA monitoring

### Don't Build Yet
- ❌ OAuth integration
- ❌ Complex permissions
- ❌ White label
- ❌ Enterprise features

## Launch Checklist

### Pre-Launch
- [ ] Domain setup: api.anytool.dev
- [ ] Landing page: anytool.dev
- [ ] Docs site: docs.anytool.dev
- [ ] Stripe products created
- [ ] Email templates (welcome, receipt)
- [ ] Terms of service
- [ ] Privacy policy
- [ ] Monitoring/alerts setup

### Launch Assets
- [ ] Demo video (60 seconds)
- [ ] Screenshots of common use cases
- [ ] Code examples
- [ ] Comparison table (DIY vs anytool)
- [ ] Pricing calculator
- [ ] Launch tweet thread
- [ ] Show HN post draft
- [ ] Indie Hackers post

### Day 1
- [ ] Post Show HN at 9am PT
- [ ] Tweet announcement
- [ ] Email list announcement
- [ ] Post in relevant Discord/Slack
- [ ] Monitor signups
- [ ] Answer questions
- [ ] Fix critical bugs immediately

### Week 1 Post-Launch
- [ ] Daily check-ins with first users
- [ ] Quick bug fixes
- [ ] Update docs based on questions
- [ ] Share early wins on Twitter
- [ ] Calculate actual costs vs revenue

## Pricing Strategy

### Launch Pricing (Simple)

**Free Tier:**
- 100 tool executions/month
- Rate limit: 10/minute
- Public cache (shared)
- Community support
- **Goal:** Let people try it

**Paid Tier - $19/mo:**
- 1,000 tool executions/month
- Rate limit: 100/minute
- Priority queue
- Email support
- **Goal:** Indie developers, side projects

**Pro Tier - $99/mo:**
- 10,000 tool executions/month
- Rate limit: 1,000/minute
- Priority queue
- Dedicated support
- **Goal:** Agencies, startups

### Later Pricing (After PMF)

Add:
- Pay-as-you-go ($0.02 per execution over limit)
- Enterprise ($999/mo custom limits)
- White label option
- On-premise option

## Success Metrics

### Week 1
- ✓ inbox.dog integration working
- ✓ Zero downtime
- ✓ <100ms cached response time

### Week 4
- ✓ Auth working
- ✓ Billing working
- ✓ 3 test users successfully paid

### Week 8
- Target: 10 paying customers ($190/mo)
- Target: 95%+ uptime
- Target: <500ms average response time

### Month 3
- Target: 25 paying customers ($500/mo)
- Target: Break-even on costs
- Target: 5-star reviews from users

### Month 6
- Target: 50 paying customers ($1,000/mo)
- Target: MCP server launched
- Target: Profitable

### Year 1
- Target: 200 paying customers ($5,000/mo)
- Target: 99.9% uptime
- Target: Consider raising prices

## Open Source Strategy

### During Dogfooding/MVP
- Keep it private
- Focus on making it work
- No distractions from OSS support

### After Launch (3-6 months)
- Open source v1 as marketing
- "Old version free, new version paid"
- Drives people to paid service
- Shows you're not hiding anything

### Never Open Source
- Current production code
- Auth/billing logic
- API keys/secrets
- Customer data

## The Bottom Line

**Goal:** $1,000/mo recurring in 3 months

**Path:**
1. Make it work (Week 1)
2. Make it paid (Week 2-3)
3. Make it public (Week 4-5)
4. Make it better (Ongoing)

**Success = Using it yourself + Others paying for it**

This is achievable. Let's go.

