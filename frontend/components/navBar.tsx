import Link from 'next/link'
import { Navbar, Text } from '@mantine/core'
import { useState } from 'react';

const NavBar = () => {
  const [opened, setOpened] = useState(false);
  return (
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} onClick={() => setOpened(o => !o)} width={{ sm: 200, lg: 300 }}>
      <Link href="/history">
        <Text><button>History</button></Text>
      </Link>
      <Link href="/weekly">
        <Text><button>Weekly</button></Text>
      </Link>
    </Navbar>
  )
}

export default NavBar
