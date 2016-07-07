<template>
    <div>
      <label for="inventory-select">Select from Inventory</label>
      <select id="inventory-select" name="inventory_id" placeholder="Item Name | Size | SKU"></select>
    </div>
</template>

<script>
  import * as actions from '~/components/inventory/vuex/actions'
  import { list as getters } from '~/components/inventory/vuex/getters'

  export default {
    strict: true,
    data: () => ({
      loaded: false,
      selectizeObj: null,
      selectedList: []
    }),
    vuex: { actions, getters },
    methods: {
      initSelectize(success) {
        this.selectizeObj = $('#inventory-select').selectize({
          valueField: 'inventory_id',
          labelField: 'search_field',
          searchField: 'search_field',
          maxOptions: 10,
          closeAfterSelect: true,
          hideSelected: true,
          create: false,
          options: this.list
        })[0].selectize
        this.selectizeObj.on('item_add', (inventory_id) => {
          this.$dispatch('inventory', inventory_id)
          let index = this.list.map(item => item.inventory_id).indexOf(inventory_id) //find index of inventory item
          this.selectedList = [...this.selectedList, this.list.splice(index, 1)[0]] //save for later by pasting into selectedList
          this.selectizeObj.clear() //removed selected options so user has a blank select box to choose new item from
          this.selectizeObj.removeOption(inventory_id) //remove selected item from the options list
          this.selectizeObj.refreshOptions(false) //refresh the options list so that changes are reflected
        })
        this.loaded = true //start once all data is loaded
      }
    },
    events: {
      'removed-item'(item_id) {
        let item = this.selectedList.filter(item => {
          return item.inventory_id == item_id
        })[0]
        this.selectizeObj.addOption(item)
        this.list.push(item)
        this.selectizeObj.refreshOptions(false)
      }
    },
    watch: {
      'selected'(val) {
        if (this.loaded && this.selected) { return }
        setTimeout(() => {this.selectizeObj.addItem(val)}, 500)
      }
    },
    ready() {
      if(!this.list.length) {
        this.get('inventory').then(
          success => {
            this.initSelectize()
          },
          error => {
            this.$alert.danger({
              message: 'The server responded with an error.',
              markup: error.data
            })
          }
        )
      }
    }
  }
</script>

<style>

</style>
