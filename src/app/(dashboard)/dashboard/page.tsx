import { authoOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

type DashboardProps = {

}

export const Dashboard = async (props: DashboardProps) => {

  const session = await getServerSession(authoOptions);  

  return (
    <pre>DashBoard</pre>
  )
}




export default Dashboard;