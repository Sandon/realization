/**
 * Created by Sandon on 2017/5/11.
 */
const template =
`
<div>
  <ul v-if="list.length">
    <li v-for="item in list">abc{{item.name}}xyz</li>
  </ul>
  <span v-else>列表为空</span>
</div>
`

const data = {
  list: [
    {name: 'abc'},
    {name: 'xyz'}
  ]
}
