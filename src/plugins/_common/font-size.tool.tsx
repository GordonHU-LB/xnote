import { inject, onUnmounted, useSignal } from '@viewfly/core'
import { Commander, Query, QueryStateType } from '@textbus/core'

import { Dropdown } from '../../components/dropdown/dropdown'
import { Button } from '../../components/button/button'
import { MenuItem } from '../../components/menu-item/menu-item'
import { RefreshService } from '../../services/refresh.service'
import { fontSizeFormatter } from '../../textbus/formatters/font-size'

export function FontSizeTool() {
  const currentFontSize = useSignal('')
  const fontSizeOptions = [
    '',
    '12px',
    '13px',
    '14px',
    '15px',
    '16px',
    '18px',
    '20px',
    '22px',
    '26px',
    '30px',
    '36px',
    '48px',
    '72px',
  ]

  const commander = inject(Commander)

  function check(v: string) {
    commander.applyFormat(fontSizeFormatter, v)
  }

  const refreshService = inject(RefreshService)
  const query = inject(Query)

  const highlight = useSignal(false)

  const subscription = refreshService.onRefresh.subscribe(() => {
    const result = query.queryFormat(fontSizeFormatter)
    const isHighlight = result.state === QueryStateType.Enabled
    highlight.set(isHighlight)
    currentFontSize.set(isHighlight ? result.value! : '')
  })

  onUnmounted(() => {
    subscription.unsubscribe()
  })

  return () => {
    return (
      <Dropdown onCheck={check} menu={fontSizeOptions.map(i => {
        return {
          label: <MenuItem checked={currentFontSize() === i}>{i || '默认'}</MenuItem>,
          value: i
        }
      })}>
        <Button arrow={true} highlight={highlight()}>
          <span class="xnote-icon-font-size"></span>
          <span>{currentFontSize() || '默认'}</span>
        </Button>
      </Dropdown>
    )
  }
}