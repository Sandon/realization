/**
 * Created by Sandon on 2017/5/11.
 */
const template =
`
<div>
  <p v-if="list.length">
    {{list[list.length - 1]}}
  </p>
  <span v-else>列表为空</span>
</div>
`