<template>
  <div>
    <table class="table-striped">
      <thead>
        <tr>
          <th>Exchange Order#</th>
          <th>SKU Returned</th>
          <th>SKU Requested</th>
          <th>MDS Order#</th>
          <th>Note</th>
          <th>Found?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in adjustedBarcodes" class="{{item.isFound ? 'duplicate' : 'exchange'}}">
          <td>{{item.code}}</td>
          <td>{{getSku(item.code)}}</td>
          <td>Coming Soon</td>
          <td>Coming Soon</td>
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
          <th>TE-SKU</th>
          <th>Description</th>
          <th>D / G</th>
          <th>Comments (click to edit)</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in rawReturns" :class="{'duplicate': !item.isUnique, 'exchange': item.isExchange}">
          <td>{{item['ORDER#']}}</td>
          <td>{{item['TIPSY SKU']}}</td>
          <td>{{item['DESCRIPTION']}}</td>
          <td>{{item['DAMAGED'] ? item['DAMAGED'] : '0'}} / {{item['GOOD'] ? item['GOOD'] : '0'}}</td>
          <td @click="onOpenNote($index)">{{item['COMMENTS'] ? item['COMMENTS'] : ''}}</td>
          <td>{{moment(item['DATE']).format("ddd, MMM Do")}}</td>
        </tr>
      </tbody>
    </table>
    <br>
    <label for="returns-list">Returns List</label>
    <textarea name="returns-list" rows="10" v-model="returnsList" style="width: 100%"></textarea>
    <button class="btn btn-large btn-default" type="button" name="button" @click="copyToClip(returnsList)">Copy to clipboard</button>
    <br>
    <label for="returns-list">Exchange List</label>
    <textarea name="returns-list" rows="10" v-model="exchangesList" style="width: 100%"></textarea>
    <button class="btn btn-large btn-default" type="button" name="button" @click="copyToClip(exchangesList)">Copy to clipboard</button>
    <button class="btn btn-large btn-primary" type="button" name="button" v-link="'/refunds/step-three'">Proceed to Step 3</button>
    <dialog class="mdl-dialog">
      <form @submit.prevent="onEditNote">
        <h4 class="mdl-dialog__title">Edit</h4>
        <div class="mdl-dialog__content">
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input class="mdl-textfield__input" type="text" v-model="noteMessage" id="note">
            <label class="mdl-textfield__label" for="note">Update Comment</label>
          </div>
        </div>
        <div class="mdl-dialog__actions">
          <button type="submit" class="mdl-button">Add</button>
          <button type="button" class="mdl-button close" @click.prevent="onCloseNote">Cancel</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script>
  import { Converter } from 'csvtojson'
  import _ from 'lodash'
  import moment from 'moment'

  export default {
    name: 'step-2',
    data () {
      return {
        returnsList: '',
        exchangesList: '',
        noteMessage: '',
        noteIndex: null,
        moment: moment
      }
    },
    vuex: {
      getters: {
        barcodes: ({ barcode }) => barcode.list,
        adjustedBarcodes: ({ barcode }) => barcode.exchangeList,
        rawReturns: ({ barcode }) => barcode.rawReturns
      },
      actions: {
        SET_RETURNS_LIST: ({ dispatch }, list) => dispatch('SET_RETURNS_LIST', list),
        SET_EXCHANGES_LIST: ({ dispatch }, list) => dispatch('SET_EXCHANGES_LIST', list),
        SET_RAW_RETURNS_LIST: ({ dispatch }, list) => dispatch('SET_RAW_RETURNS_LIST', list),
        TOGGLE_IS_FOUND: ({ dispatch }, index) => dispatch('TOGGLE_IS_FOUND', index),
        UPDATE_COMMENT: ({ dispatch }, payload) => dispatch('UPDATE_COMMENT', payload)
      }
    },
    methods: {
      adjustCode (code) {
        if (code.length === 9) { return code }
        return code.substring(6).replace(/1/, '100')
      },
      onOpenNote (index) {
        let dialog = document.querySelector('.mdl-dialog')
        this.noteMessage = this.rawReturns[index].COMMENTS
        this.noteIndex = index
        dialog.showModal()
      },
      onEditNote (index) {
        this.UPDATE_COMMENT({ index: this.noteIndex, note: this.noteMessage })
        this.onCloseNote()
      },
      onCloseNote () {
        let dialog = document.querySelector('.mdl-dialog')
        this.noteIndex = null
        this.noteMessage = ''
        dialog.close()
      },
      getSku (code) {
        if (!this.rawReturns.length) { return 'TE-' }
        return this.rawReturns.filter(item => item['ORDER#'] === code)[0]['TIPSY SKU']
      },
      adjustReturn (code) {
        return code.replace(/1/, '100')
      },
      copyToClip (list) {
        this.$electron.clipboard.writeText(list)
      },
      renderReturnsList () {
        // generate clipboard textarea
        this.returnsList = this.rawReturns.map(barcode => {
          if (!barcode.isExchange) {
            return `${barcode['ORDER#']}\t${barcode['TIPSY SKU']}\t${barcode['DESCRIPTION']}\t${barcode['DAMAGED']}\t${barcode['GOOD']}\t${barcode['COMMENTS']}\t${barcode['DATE']}`
          }
        }).filter(row => !_.isUndefined(row)).join('\n')
        this.returnsList = 'Order#\t TE-SKU\t Description\t Damaged\t Good\t Comments\t Date\t\n'.concat(this.returnsList)
        // save returns list to state
        this.SET_RETURNS_LIST(this.rawReturns.filter(barcode => !barcode.isExchange))

        // render exchanges list
        this.exchangesList = this.rawReturns.map((barcode) => {
          if (barcode.isExchange) {
            return `${barcode['ORDER#']}\t${barcode['TIPSY SKU']}\t \t \t${barcode['DATE']}\t${barcode['COMMENTS']}`
          }
        }).filter(row => !_.isUndefined(row)).join('\n')
        this.exchangesList = 'Order#\tSKU Returned#\tSKU Requested#\tMDS Order#\tDate\tComments\n'.concat(this.exchangesList)
      },
      onFileUpload (event) {
        let converter = new Converter({})
        Array.prototype.forEach.call(event.target.files, (file, index) => {
          converter.fromFile(file.path, (err, result) => {
            if (err) { return console.error(err) }
            this.SET_RAW_RETURNS_LIST(result.map(item => {
              // convert order string to number
              if (typeof item['ORDER#'] === 'number') {
                item['ORDER#'] = item['ORDER#'].toString()
              }
              item['DAMAGED'] = item['DAMAGED'] ? item['DAMAGED'] : 0
              // mutate the order number to match Tipsy UPC
              item['ORDER#'] = this.adjustReturn(item['ORDER#'])
              return item
            }))
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
                this.renderReturnsList()
              }
            })
          })
        })
      }
    },
    watch: {
      'rawReturns': {
        handler () {
          this.renderReturnsList()
        },
        deep: true
      }
    },
    ready () {
      let barcodes = this.barcodes.map(barcode => {
        return { code: this.adjustCode(barcode.code), note: barcode.notes, returned: '', requested: '', mdsOrder: '', isFound: false }
      })
      this.SET_EXCHANGES_LIST(barcodes)
      this.renderReturnsList()
      window.componentHandler.upgradeAllRegistered()
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
