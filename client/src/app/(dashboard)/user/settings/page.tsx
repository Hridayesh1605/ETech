import SharedNotificationSettings from '@/components/SharedNotificationSettings'
import React from 'react'

const UserSettings = () => {
  return (
    <div className='w-3/5'>
        <SharedNotificationSettings
        title='User Settings'
        subtitle='Manage Your user notification settings'

        />
    </div>
  )
}

export default UserSettings