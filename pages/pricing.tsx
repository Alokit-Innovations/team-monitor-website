import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import Button from '../components/Button';
import Footer from '../components/Footer';
import RudderContext from '../components/RudderContext';
import SwitchSubmitWithText from '../components/SwitchSubmitWithText';
import { getAuthUserId, getAuthUserName } from '../utils/auth';
import { getUserLocation, isUserInIndia } from '../utils/location';
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/rudderstack_initialize';
import Navbar from '../views/Navbar';

const monthlyBasePriceUSD = 15;
const monthlyBasePriceINR = 1000;

const pricingPlans = [
	{
		pricingName: 'Free',
		duration: '',
		pricing: 'for open source projects',
		buttonText: 'Add a Repo',
		link: '/docs'

	},
	{
		pricingName: 'Solo',
		duration: 'per month',
		pricing: undefined, // will be populated by formula
		buttonText: 'Start your 30 day trial',
		link: '/u'
	},
	{
		pricingName: 'Enterprise',
		duration: '',
		pricing: 'custom pricing',
		buttonText: 'Contact Us',
		link: 'https://api.whatsapp.com/send/?phone=918511557566&text&type=phone_number&app_absent=0'

	},
]


const Pricing = () => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;

	const [location, setLocation] = useState<GeolocationPosition>();
	const [term, setTerm] = useState<string>('monthly');
	let termOptions = [
		{ label: "Pay monthly", value: 'monthly' },
		{ label: "Pay yearly", value: 'yearly' },
	]
	const [selectedRepoType, setSelectedRepoType] = useState<string>('public');
	const repoTypeOptions = [
		{ value: 'public', label: 'Public repository' },
		{ value: 'private', label: 'Private repository' },
	];
	const [selectedInstallation, setSelectedInstallation] = useState<string>('project');
	const installationOptions = [
		{ value: 'project', label: 'For your team' },
		{ value: 'individual', label: 'For yourself' },
	];
	const onAnyPricingConfigClick = React.useCallback(
		(callback: (option: string) => void) => {
			rudderEventMethods?.track(
				getAuthUserId(session),
				"pricing-changed",
				{ type: "button", eventStatusFlag: 1, config: { term, selectedRepoType, selectedInstallation }, name: getAuthUserName(session) },
				getAndSetAnonymousIdFromLocalStorage()
			);
			return callback;
		},
		[term, selectedRepoType, selectedInstallation, session, rudderEventMethods]
	)

	const [pricingPlanIndex, setPricingPlanIndex] = useState<number>(0);
	const [features, setFeatures] = useState<string[]>([]);
	React.useEffect(() => {
		if (selectedRepoType === 'public') {
			setPricingPlanIndex(0);
		} else if (selectedInstallation === 'individual') {
			setPricingPlanIndex(1);
		} else if (selectedInstallation === 'project') {
			setPricingPlanIndex(2);
		}

		const features: string[] = [];
		if (selectedInstallation === 'project') {
			features.push(...[
				'PR comment with relevant reviewers',
				'Auto-assign relevant reviewers',
				'Personalized highlighting',
			]);
		} else {
			features.push(...[
				'Auto-assign relevant reviewers',
				'Personalized highlighting',
			])
		}
		if (selectedRepoType === 'private') {
			features.push('Direct support through Slack')
			if (selectedInstallation === 'project') {
				features.push(...[
					'On-call support',
					'Free-of-cost setup assistance',
				]);
			}
		} else if (selectedInstallation === 'project') {
			features.push('Unlimited team size')
		}
		setFeatures(features);
	}, [selectedRepoType, selectedInstallation]);

	const getPriceString = (term: string) => {
		const isInIndia = isUserInIndia(location);

		const currency: '$' | '₹' = isInIndia ? '₹' : '$';
		const monthlyBasePrice = isInIndia ? monthlyBasePriceINR : monthlyBasePriceUSD;
		const priceDecimal = (term === 'yearly' ? (10 / 12) : 1) * monthlyBasePrice;
		const price = Math.round(priceDecimal * 100) / 100;
		return (<span className='font-money'>  {currency} <span className='text-4xl'>{price} </span ></span>);
	}

	const pricingStartDate = new Date(2023, 9, 31); // 31st October 2023
	const today = new Date();
	const readableDate = (date: Date) => date.toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })

	React.useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		rudderEventMethods?.track(getAuthUserId(session), "pricing-page", { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId)
	}, [rudderEventMethods, session]);

	React.useEffect(() => {
		getUserLocation()
			.then(position => setLocation(position))
			.catch(err => {
				console.info("Could not get user's location. Using international values.", err.message);
			})
	}, [])

	return (
		<div>
			<div className='mb-16'>
				<Navbar transparent={false} />
			</div>
			<div id='pricing' className='w-full py-12'>
				<h2 className='font-bold text-center text-[2rem]'>Pricing <span className='text-[2rem] text-secondary font-bold'>Plans</span></h2>
				{(today <= pricingStartDate) ? (<p className='text-center -mt-2'><small>(Applicable after {readableDate(pricingStartDate)})</small></p>) : null}

				<div className='m-auto md:grid w-4/5 mt-3 md:p-4 grid-cols-2 gap-5 h-fit'>
					<div className='flex flex-col gap-4 mt-8 p-3 md:p-5 h-full w-full lg:w-5/6 xl:w-4/5 mx-auto'>
						<h3>Choose your configuration:</h3>
						<SwitchSubmitWithText optionsList={repoTypeOptions} selectedOption={selectedRepoType} setSelectedOption={setSelectedRepoType} />
						<SwitchSubmitWithText optionsList={installationOptions} selectedOption={selectedInstallation} setSelectedOption={setSelectedInstallation} />
						<SwitchSubmitWithText optionsList={termOptions} selectedOption={term} setSelectedOption={onAnyPricingConfigClick(setTerm)} />
					</div>
					<div key={pricingPlans[pricingPlanIndex].buttonText} className="md:p-5 p-3 rounded-lg border-2 mt-7 w-full lg:w-5/6 xl:w-4/5 m-auto border-secondary bg-background shadow-md flex flex-col h-full">
						<h2 className='mx-auto font-semibold text-2xl text-center'>{pricingPlans[pricingPlanIndex].pricingName}</h2>

						<div className='text-center h-16'>
							<p className='mt-2 font-medium text-xl text-secondary'>{(pricingPlans[pricingPlanIndex].pricing) ? pricingPlans[pricingPlanIndex].pricing : getPriceString(term)}</p>
							<p className='text-base'>{((pricingPlans[pricingPlanIndex].duration && selectedInstallation === 'project') ? 'per user/month' : pricingPlans[pricingPlanIndex].duration)}</p>
						</div>

						<ul className='mt-3.5 grow'>
							{features.map((feature) => {
								return (
									<li key={feature} className='text-lg ml-1 mb-2'>
										<AiOutlineCheckCircle className='text-secondary w-5 inline mr-1' size={20} />
										{feature}
									</li>
								)
							})}
						</ul>
						<Button variant='contained' href={pricingPlans[pricingPlanIndex].link} target='_blank' className='w-full py-4 text-xl'>
							{pricingPlans[pricingPlanIndex].buttonText}
						</Button>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}
export default Pricing