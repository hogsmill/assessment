<template>
  <div>
    <div v-if="step == 1">
      <p>
        You can do individual assessments, and get resultd emailed, fo free, but to
        get the most out of this assessment, you will need to purchase a basic licence
        from <a href="https://agilesimulations.co.uk/?pricing">Agile Simulations</a>.
        This will also give you full access to a whole raft of other engaging
        agile games and workshops.
      </p>
    </div>
    <div v-if="step == 2">
      <p>
        The real value of doing {{ appType }} assessments comes from doing them
        regularly and across all teams in your organisation.
      </p>
      <p>
        Doing assessments regularly (<em>usually once a month</em>) allows you to spot
        trends; are things improving? Are they getting worse?
      </p>
      <p>
        Doing assessments across all teams allows you to spot issues that are common
        across multiple teams which may be a sign of a deeper issue across the
        organisation that cannot be solved within individual teams.
      </p>
      <p>
        Both of these types of analysis come as standard with Agile Simulations
        assessments, saving you time and effort in creating your own analysis from
        spreadsheets or other tools.
      </p>
    </div>
    <div v-if="step == 3">
      <p>
        Analysis can be shown for individuals, single teams, or all teams across the
        organisation. For teams and the organisation, data can be aggregated to a single
        value, e.g. to inspect a particular month's data, or tabulated or graphed per
        team to show overall trends.
      </p>
      <div class="summary-controls" />
      <p>
        The assessment can also be set up to be run in various ways, e.g. individuals
        can take the assessment in their own time, or they can be run as a team activity
        with the facilitator controlling when the questions move on - or anything in
        between...
      </p>
    </div>
    <div v-if="step == 4">
      <p>
        Both the Team Health Check and the 5 Dysfunctions assessments run on the
        Agile Simulations assessment platform, so it is easy to change, add or delete
        questions to suit your organisation.
      </p>
      <p>
        It also simple to add new types of assesment - agile maturity models, development
        practices, etc.; all you need is a set of questions and - if necessary - a way
        of calculating results (<em>this is often standard...</em>). All other
        functionality - team setup, aggregation analysis, graphing, etc. will be
        available by default.
      </p>
      <p>
        See the <a href="https://agilesimulations.co.uk/?pricing">Web Site</a> for 
        more details.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'step'
  ],
  computed: {
    appType() {
      return this.$store.getters.appType
    }
  }
}
</script>

<style lang="scss">
  .summary-controls {
    height: 80px;
    margin: 0 24px;
    background-image: url("../../../assets/img/summary.jpg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
