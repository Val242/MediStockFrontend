import TopSection from '@/components/TopSection'
import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const map = () => {
  return (
    <View>
       <SafeAreaView>
            <TopSection/>
      
        </SafeAreaView>
    </View>
  )
}

export default map