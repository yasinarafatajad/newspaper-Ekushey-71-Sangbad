import { formatDate } from '@/lib/utils'
import Image from 'next/image'

export const Category = () => {
    const date : string = new Date().toLocaleDateString()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-neutral-muted pt-8">
            <div>
                <h3 className="text-xl font-bold border-l-4 border-primary pl-3 mb-6">আন্তর্জাতিক</h3>
                <div className="space-y-6">
                    <div className="flex gap-4 group cursor-pointer">
                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                            <Image className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                alt="Global political summit meeting room"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKo1e0aSNVAnQzvs_hSeSlsCKTactHqD6nxBsebIKCXudZ5mpuMgNAq7UjY4gmlpTsdKXmwY7UGWcxKBE4iXV8MD58dYrZLdtqKbaaNziqIiGCXwODe8c84Vja3gDLDuq017Kwfj83A5MlFMi4Y1J4jTBNNPZIOWaXEuRq1FlmCenJJS_uLQI0vERYnMa2qWgHoYHXzWz28t-xZNXBsGJHTXp04pW1XUnxVWZg41TiylfwQEh5_lDxY73p1m1Ltmr0Vf9EZDKz9ccJ"
                                height={96}
                                width={96}
                            />

                        </div>
                        <div>
                            <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">মধ্যপ্রাচ্যে শান্তি
                                ফেরাতে বড় উদ্যোগ বড় দেশগুলোর</h4>
                            <span className="text-xs text-slate-500">{formatDate(date)}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 group cursor-pointer">
                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                            <Image className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                alt="Satellite image of Earth from space"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm8GvQFdIcDMImPNkwHOGStt9_gabpdwRURAycX3c1DIINWhtLKBAFD9RNCrLSaLixGxv_S6rGKIeZLNrJ8yu85B3nX942WjGKqg72___dBaFnP4UhDHGBDsUWhsmtgb09kg28EDV1Omq9bcvDSQZvlvdH6vDHw-VI6VwZ08QDQ9fhvoRA6DbzmVnZPuiSoFAxQo01PPen6XPdxvMp1fdFMORMI0FdZvre87HMUsJGHYmODLNPyB1ynXeAoC8htfTwf_4-XCT12kV4"
                                height={96}
                                width={96}
                            />
                        </div>
                        <div>
                            <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">জলবায়ু পরিবর্তন রোধে
                                নতুন প্রযুক্তির উদ্ভাবন</h4>
                            <span className="text-xs text-slate-500">{formatDate(date)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold border-l-4 border-primary pl-3 mb-6">জাতীয়</h3>
                <div className="space-y-6">
                    <div className="flex gap-4 group cursor-pointer">
                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                            <Image className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                alt="Construction site of a major bridge"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ-sT56RlCMj6ilS8WnTrzxDN7sZXUmmYdImhvoSynsE7POGtie0O1CBXt4oolos5RUGoGzBNniLsclWKE16qyKfwyn7MlUf1IdGHL_GK6x3MMd6Y_phlnOwOHbKMUFfGTgC7SYbZZMBMYdwWDbOd8Ew2HBgwGHkn1f2sbUnX0G5lVxFVKCOC6S8Th44IGzFEfinTTOiXSOVHqd9K_LqaoCo7iDH8jYOEazp0mw40Ea8aUADTuEafCVP7OseI6oUTwJkx4ab2oq3ui"
                                height={96}
                                width={96}
                            />
                        </div>
                        <div>
                            <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">মেট্রোরেলের নতুন রুটের
                                কাজ শুরু হচ্ছে আগামী মাসেই</h4>
                            <span className="text-xs text-slate-500">{formatDate(date)}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 group cursor-pointer">
                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                            <Image className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                alt="Agricultural fields with green crops"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwXaKnrubo8lwgh7f0Wz8n0BpI4KUFi80_tRT8-Khk5NKrp-2MahnXWSlTUDYTLkMzBNI-C6sMAO4_sksQnqkNlrZEA7RtxSRUy0bePI1DNoesR9lvysI-Y5-PhkRHX-ow9cu0hkK7gr8k-BKuCgjQ5xlvTO3Vn-NDdJo4_b9blKwWV-QvXO_S7XZkpVqU5f1MM1epQr3-5L1X8SBj_G0T4Pb7a2NnFYYEcIUZR9STFCVpMF13nda1PG0eXETlPCvRsTdzxuxLt9c6"
                                height={96}
                                width={96}
                            />
                        </div>
                        <div>
                            <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">ধানের বাম্পার ফলনে
                                কৃষকের মুখে স্বস্তির হাসি</h4>
                            <span className="text-xs text-slate-500">{formatDate(date)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
