<template>
  <div>
    <table class="table-striped">
      <thead>
        <tr>
          <th>Exchange Order#</th>
          <th>Note</th>
          <th>Found?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in adjustedBarcodes" class="{{item.isFound ? 'duplicate' : 'exchange'}}">
          <td>{{item.code}}</td>
          <td>{{item.note}}</td>
          <td>{{item.isFound ? 'Found!' : 'Not Found'}}</td>
        </tr>
      </tbody>
    </table>
    <hr>
    <div class="form-group">
      <label for="file-upload">{{rawReturns.length ? 'Upload Another .CSV' : 'Upload .CSV'}}</label><br>
      <input type="file" name="file-upload" @change="onFileUpload">
    </div>
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
        <tr v-for="item in rawReturns" :class="{'duplicate': !item.isUnique, 'exchange': item.isExchange}">
          <td>{{item['ORDER#']}}</td>
          <td>{{item['SKU']}}</td>
          <td>{{item['TIPSY SKU']}}</td>
          <td>{{item['DESCRIPTION']}}</td>
        </tr>
      </tbody>
    </table>
    <textarea name="name" rows="10" v-model="barcodeList" style="width: 100%"></textarea>
    <button class="btn btn-large btn-default" type="button" name="button" @click="copyToClip">Copy to clipboard</button>
    <button class="btn btn-large btn-primary" type="button" name="button" v-link="'/refunds/step-three'">Proceed to Step 3</button>
  </div>
</template>

<script>
  import { Converter } from 'csvtojson'
  import _ from 'lodash'

  export default {
    name: 'step-2',
    data () {
      return {
        rawReturns: [],
        barcodeList: ''
      }
    },
    vuex: {
      getters: {
        barcodes: ({ barcode }) => barcode.list,
        adjustedBarcodes: ({ barcode }) => barcode.exchangeList
      },
      actions: {
        SET_RETURNS_LIST: ({ dispatch }, list) => dispatch('SET_RETURNS_LIST', list),
        SET_EXCHANGES_LIST: ({ dispatch }, list) => dispatch('SET_EXCHANGES_LIST', list),
        TOGGLE_IS_FOUND: ({ dispatch }, index) => dispatch('TOGGLE_IS_FOUND', index)
      }
    },
    methods: {
      adjustCode (code) {
        return code.substring(6).replace(/1/, '100')
      },
      adjustReturn (code) {
        return code.replace(/1/, '100')
      },
      copyToClip () {
        this.$electron.clipboard.writeText(this.barcodeList)
      },
      onFileUpload (event) {
        let converter = new Converter({})
        Array.prototype.forEach.call(event.target.files, (file, index) => {
          converter.fromFile(file.path, (err, result) => {
            if (err) { return console.error(err) }
            this.rawReturns = result.map(item => {
              // convert order string to number
              if (typeof item['ORDER#'] === 'number') {
                item['ORDER#'] = item['ORDER#'].toString()
              }
              // mutate the order number to match Tipsy UPC
              item['ORDER#'] = this.adjustReturn(item['ORDER#'])
              return item
            })
            // add unique flag to unique barcodes
            _.uniqBy(this.rawReturns, 'ORDER#').map((barcode, index, array) => {
              return Object.assign(barcode, { isUnique: true })
            })

            this.rawReturns.map((item, index, array) => {
              // make first of non-unique rows to not be unique
              if (index > 0) {
                let prev = array[index - 1]
                if (!item.isUnique) {
                  Object.assign(prev, { isUnique: false })
                }
              }
              // check scanned barcodes for matches
              this.adjustedBarcodes.forEach((barcode, exchangeIndex) => {
                if (barcode.code === item['ORDER#']) {
                  Object.assign(item, { isExchange: true })
                  this.TOGGLE_IS_FOUND(exchangeIndex)
                }
              })
              if (index === array.length - 1) {
                // generate clipboard textarea
                this.barcodeList = this.rawReturns.map(barcode => {
                  if (!barcode.isExchange) {
                    return `${barcode['ORDER#']}\t${barcode['SKU']}\t${barcode['TIPSY SKU']}\t${barcode['DESCRIPTION']}`
                  }
                }).filter(row => !_.isUndefined(row)).join('\n')
                // save returns list to state
                this.SET_RETURNS_LIST(this.rawReturns.filter(barcode => !barcode.isExchange))
              }
            })
          })
        })
      }
    },
    ready () {
      let barcodes = this.barcodes.map(barcode => {
        return { code: this.adjustCode(barcode.code), note: barcode.notes, isFound: false }
      })
      this.SET_EXCHANGES_LIST(barcodes)
    }
  }
</script>

<style scoped lang="scss">
  .duplicate {
    background-color: rgba(0,255,0,0.2) !important;
  }
  .exchange {
    background-color: rgba(255,0,0,0.2) !important;
  }
</style>
