<template>
    <div>
        <ots-refer v-bind='$attrs' v-on='$listeners'></ots-refer>
        <ots-table-new v-bind='$attrs' v-on='$listeners'></ots-table-new>
        <ots-pagination v-bind='$attrs' v-on='$listeners'></ots-pagination>
    </div>
</template>
<script>
  export default {
    name: 'OtsTableGroupNew', 
  }
</script>
