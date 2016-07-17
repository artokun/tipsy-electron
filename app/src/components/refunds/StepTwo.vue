<template>
  <table class="table-striped">
    <thead>
      <tr>
        <th>Exchange Order#</th>
        <th>Note</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in adjustedBarcodes">
        <td>{{item.code}}</td>
        <td>{{item.note}}</td>
      </tr>
    </tbody>
  </table>
  <hr>
  <input type="file" name="name" @change="onFileUpload" v-show="!rawReturns.length">
  <hr>
  <!-- <pre>{{rawReturns | json}}</pre> -->
  <table class="table-striped" v-show="rawReturns.length">
    <thead>
      <tr>
        <th>Order#</th>
        <th>SKU</th>
        <th>TE-SKU</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in rawReturns" :class="isExchange(item['ORDER#'])">
        <td>{{item['ORDER#']}}</td>
        <td>{{item['SKU']}}</td>
        <td>{{item['TIPSY SKU']}}</td>
        <td>{{item['DESCRIPTION']}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { Converter } from 'csvtojson'

  export default {
    data () {
      return {
        rawReturns: []
      }
    },
    vuex: {
      getters: {
        barcodes: ({ barcode }) => barcode.list
      }
    },
    computed: {
      adjustedBarcodes () {
        return this.barcodes.map(barcode => {
          return { code: this.adjustCode(barcode.code), note: barcode.notes }
        })
      },
      adjustedReturns () {
        return { code: this.rawReturns }
      }
    },
    methods: {
      adjustCode (code) {
        return code.substring(6).replace(/1/, '100')
      },
      adjustReturn (code) {
        return code.replace(/1/, '100')
      },
      isExchange (orderNumber) {
        let isExchange = this.adjustedBarcodes.filter(barcode => {
          return barcode.code === orderNumber
        })
        if (isExchange.length) {
          return 'is-exchange'
        } else {
          return ''
        }
      },
      onFileUpload (event) {
        let converter = new Converter({})
        Array.prototype.forEach.call(event.target.files, (file, index) => {
          converter.fromFile(file.path, (err, result) => {
            if (err) { return console.error(err) }
            this.rawReturns = result.map(item => {
              console.debug(item['ORDER#'])
              if (typeof item['ORDER#'] === 'number') {
                item['ORDER#'] = item['ORDER#'].toString()
              }
              item['ORDER#'] = this.adjustReturn(item['ORDER#'])
              return item
            })
          })
        })
      }
    }
  }
</script>

<style scoped>
  .is-exchange {
    background-color: lightgreen;
  }
</style>
