import { authoOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

type DashboardProps = {

}

export const Dashboard = async (props: DashboardProps) => {

  const session = await getServerSession(authoOptions);  

  return (
    <pre>{JSON.stringify(session)}</pre>
  )
}




export default Dashboard;