<template>
    <div>
        <ots-refer v-bind='$attrs' v-on='$listeners'></ots-refer>
        <ots-table v-bind='$attrs' v-on='$listeners'></ots-table>
        <ots-pagination v-bind='$attrs' v-on='$listeners'></ots-pagination>
    </div>
</template>
<script>
  export default {
    name: 'OtsTableGroup', 
  }
</script>
