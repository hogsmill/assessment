<template>
  <div class="details">
    <p>
      Please enter your details, and we'll send you your results
    </p>
    <table>
      <tr>
        <td class="right">
          Name
        </td>
        <td>
          <input type="text" id="details-name">
        </td>
      </tr>
      <tr>
        <td class="right">
          Organisation
        </td>
        <td>
          <input type="text" id="details-organisation">
        </td>
      </tr>
      <tr>
        <td class="right">
          Email
        </td>
        <td>
          <input type="text" id="details-email">
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss">
  .details {
    font-size: 1.75rem;

    table {
      margin: 0 auto;

      td {
        padding: 6px;

        &.right {
          text-align: right;
        }
      }
    }
  }
</style>
