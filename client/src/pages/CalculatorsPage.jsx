import React, { useState, useEffect } from 'react';
import CalculatorCard from '../components/calculators/CalculatorCard';

const formatINR = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const abbrevINR = (num) => {
  if (num >= 1e7) return `(${(num / 1e7).toFixed(2)} Cr)`;
  if (num >= 1e5) return `(${(num / 1e5).toFixed(2)} Lakh)`;
  if (num >= 1e3) return `(${(num / 1e3).toFixed(2)} K)`;
  return '';
};

const CalculatorsPage = () => {
  // ---------------- Loan EMI Calculator ----------------
  const [loanPrincipal, setLoanPrincipal] = useState(100000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(5);
  const [emi, setEmi] = useState(0);

  const calculateEmi = () => {
    const p = parseFloat(loanPrincipal);
    const r = parseFloat(loanRate) / 1200;
    const n = parseFloat(loanTenure) * 12;
    if (p > 0 && r >= 0 && n > 0) {
      setEmi(((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)).toFixed(2));
    } else {
      setEmi(0);
    }
  };

  const resetLoan = () => {
    setLoanPrincipal(100000);
    setLoanRate(8.5);
    setLoanTenure(5);
    setEmi(0);
  };

  // ---------------- SIP Calculator ----------------
  const [sipInvestment, setSipInvestment] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipDuration, setSipDuration] = useState(10);
  const [futureValue, setFutureValue] = useState(0);

  const calculateSip = () => {
    const p = parseFloat(sipInvestment);
    const i = parseFloat(sipRate) / 1200;
    const n = parseFloat(sipDuration) * 12;
    if (p > 0 && i >= 0 && n > 0) {
      setFutureValue((p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)).toFixed(0));
    } else {
      setFutureValue(0);
    }
  };

  const resetSip = () => {
    setSipInvestment(5000);
    setSipRate(12);
    setSipDuration(10);
    setFutureValue(0);
  };

  // ---------------- Gold/Silver Ratio Calculator ----------------
  const [goldPrice, setGoldPrice] = useState(2300);
  const [silverPrice, setSilverPrice] = useState(28);
  const [ratioResult, setRatioResult] = useState(null);
  const [ratioError, setRatioError] = useState('');

  const calculateGoldSilverRatio = () => {
    setRatioError('');
    const gp = parseFloat(goldPrice);
    const sp = parseFloat(silverPrice);
    if (gp > 0 && sp > 0) {
      const ratio = gp / sp;
      let recommendation = '', icon = '', color = '';
      if (ratio > 90) {
        recommendation = 'Silver looks undervalued — consider buying silver.';
        icon = '💎';
        color = 'text-blue-600';
      } else if (ratio < 70) {
        recommendation = 'Gold looks undervalued — consider buying gold.';
        icon = '🌟';
        color = 'text-amber-600';
      } else {
        recommendation = 'Market looks balanced — consider both.';
        icon = '⚖️';
        color = 'text-green-600';
      }
      setRatioResult({ value: ratio.toFixed(2), recommendation, icon, color });
    } else {
      setRatioError('Please enter positive numbers for both prices.');
      setRatioResult(null);
    }
  };

  const resetGoldSilver = () => {
    setGoldPrice(2300);
    setSilverPrice(28);
    setRatioResult(null);
    setRatioError('');
  };

  // ---------------- Fixed Deposit Calculator ----------------
  const [fdPrincipal, setFdPrincipal] = useState(50000);
  const [fdRate, setFdRate] = useState(6.5);
  const [fdTenure, setFdTenure] = useState(3);
  const [fdCompoundFreq, setFdCompoundFreq] = useState('4');
  const [fdResult, setFdResult] = useState(null);
  const [fdError, setFdError] = useState('');

  const calculateFD = () => {
    setFdError('');
    setFdResult(null);
    const p = parseFloat(fdPrincipal);
    const r = parseFloat(fdRate);
    const t = parseFloat(fdTenure);
    if (!(p > 0 && r >= 0 && t >= 1 && t <= 50)) {
      setFdError('Please enter valid inputs.');
      return;
    }
    const P = p;
    const n = parseInt(fdCompoundFreq);
    const annualRate = r / 100;
    const maturityAmount = P * Math.pow((1 + annualRate / n), (n * t));
    const totalInterest = maturityAmount - P;
    const effectiveYield = (Math.pow((1 + annualRate / n), n) - 1) * 100;
    setFdResult({
      maturity: maturityAmount.toFixed(2),
      interest: totalInterest.toFixed(2),
      yield: effectiveYield.toFixed(2),
      invested: P.toFixed(2)
    });
  };

  const resetFD = () => {
    setFdPrincipal(50000);
    setFdRate(6.5);
    setFdTenure(3);
    setFdCompoundFreq('4');
    setFdResult(null);
    setFdError('');
  };

  const isFdButtonDisabled = !(
    parseFloat(fdPrincipal) > 0 &&
    parseFloat(fdRate) >= 0 &&
    parseFloat(fdTenure) >= 1 &&
    parseFloat(fdTenure) <= 50
  );

  // ---------------- Recurring Deposit Calculator ----------------
  const [rdMonthlyAmount, setRdMonthlyAmount] = useState(2000);
  const [rdRate, setRdRate] = useState(6.0);
  const [rdYears, setRdYears] = useState(5);
  const [rdMonths, setRdMonths] = useState(0);
  const [rdResult, setRdResult] = useState(null);
  const [rdError, setRdError] = useState('');

  const validateRdInputs = () => {
    const r = parseFloat(rdMonthlyAmount);
    const rate = parseFloat(rdRate);
    const totalMonths = (parseInt(rdYears) * 12) + parseInt(rdMonths);
    let errors = [];
    if (!(r > 0)) errors.push('Monthly amount must be positive.');
    if (!(rate >= 0)) errors.push('Rate cannot be negative.');
    if (totalMonths < 6 || totalMonths > 120) errors.push('Tenure must be between 6 months and 10 years.');
    return errors;
  };

  const calculateRD = () => {
    setRdError('');
    setRdResult(null);
    const validationErrors = validateRdInputs();
    if (validationErrors.length > 0) {
      setRdError(validationErrors.join(' '));
      return;
    }

    const R = parseFloat(rdMonthlyAmount);
    const annualRate = parseFloat(rdRate) / 100;
    const n = (parseInt(rdYears) * 12) + parseInt(rdMonths);
    
    // RD Formula: M = R × n × (n + 1) / 2 × (r / 12) + R × n
    // Simplified: M = R × [n(n+1)/2 × (r/12) + n]
    const monthlyRate = annualRate / 12;
    const interest = R * (n * (n + 1) / 2) * monthlyRate;
    const totalInvested = R * n;
    const maturityAmount = totalInvested + interest;

    setRdResult({
      maturity: maturityAmount.toFixed(2),
      invested: totalInvested.toFixed(2),
      interest: interest.toFixed(2),
    });
  };

  const resetRD = () => {
    setRdMonthlyAmount(2000);
    setRdRate(6.0);
    setRdYears(5);
    setRdMonths(0);
    setRdResult(null);
    setRdError('');
  };

  const isRdButtonDisabled = validateRdInputs().length > 0;

  // ---------------- Retirement Planning Calculator ----------------
  const [currentAge, setCurrentAge] = useState(24);
  const [retirementAge, setRetirementAge] = useState(55);
  const [lifeExpectancy, setLifeExpectancy] = useState(65);
  const [postRetReturn, setPostRetReturn] = useState(12);
  const [currentAnnualExpense, setCurrentAnnualExpense] = useState(100000);
  const [retirementResult, setRetirementResult] = useState(null);
  const [retirementErrors, setRetirementErrors] = useState({});

  const validateRetirementInputs = () => {
    const errors = {};
    const currAge = parseFloat(currentAge);
    const retAge = parseFloat(retirementAge);
    const lifeExp = parseFloat(lifeExpectancy);
    const postRet = parseFloat(postRetReturn);
    const currExp = parseFloat(currentAnnualExpense);

    if (currAge < 18 || currAge > 60) errors.currentAge = "Must be 18-60";
    if (retAge <= currAge || retAge > 70) errors.retirementAge = `Must be > ${currAge} and ≤ 70`;
    if (lifeExp <= retAge || lifeExp > 100) errors.lifeExpectancy = `Must be > ${retAge} and ≤ 100`;
    if (postRet < 0) errors.postRetReturn = "Cannot be negative";
    if (currExp <= 0) errors.currentAnnualExpense = "Must be > 0";
    
    setRetirementErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validateRetirementInputs();
  }, [currentAge, retirementAge, lifeExpectancy, postRetReturn, currentAnnualExpense]);

  const calculateRetirement = () => {
    if (!validateRetirementInputs()) return;

    const yrsToRet = retirementAge - currentAge;
    const yrsInRet = lifeExpectancy - retirementAge;
    const inflation = 6; // Assuming 6% inflation
    const inflationRate = inflation / 100;
    const returnRate = postRetReturn / 100;

    // Calculate annual expense at retirement considering inflation
    const annualAtRet = currentAnnualExpense * Math.pow(1 + inflationRate, yrsToRet);

    // Calculate real return rate
    const realRet = ((1 + returnRate) / (1 + inflationRate)) - 1;

    // Calculate corpus needed
    let corpus = 0;
    if (Math.abs(realRet) > 0.0001) {
      corpus = annualAtRet * ((1 - Math.pow(1 + realRet, -yrsInRet)) / realRet);
    } else {
      corpus = annualAtRet * yrsInRet;
    }

    // Calculate monthly savings needed
    const monthlyRate = returnRate / 12;
    const n = yrsToRet * 12;
    let monthlySavings = 0;
    if (monthlyRate > 0.0001) {
      monthlySavings = corpus * (monthlyRate / (Math.pow(1 + monthlyRate, n) - 1));
    } else {
      monthlySavings = corpus / n;
    }

    setRetirementResult({ corpus, monthlySavings, annualAtRet });
  };

  const resetRetirement = () => {
    setCurrentAge(24);
    setRetirementAge(55);
    setLifeExpectancy(65);
    setPostRetReturn(12);
    setCurrentAnnualExpense(100000);
    setRetirementResult(null);
    setRetirementErrors({});
  };

  // ---------------- Render ----------------
  return (
    <div className="bg-[#FAFAF5] p-4 sm:p-6 lg:p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Financial Toolkit</h1>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Loan EMI Calculator */}
        <CalculatorCard
          title="Loan EMI Calculator"
          buttonText="Calculate EMI"
          onCalculate={calculateEmi}
          onReset={resetLoan}
        >
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Loan Amount (₹)</label>
            <input
              type="number"
              value={loanPrincipal}
              onChange={e => setLoanPrincipal(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={loanRate}
              onChange={e => setLoanRate(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Loan Tenure (Years)</label>
            <input
              type="number"
              value={loanTenure}
              onChange={e => setLoanTenure(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {emi > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm">Your Monthly EMI</p>
              <p className="text-base font-medium text-gray-900">
                ₹{parseFloat(emi).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </CalculatorCard>

        {/* SIP Calculator */}
        <CalculatorCard
          title="SIP Calculator"
          buttonText="Calculate F.Value"
          onCalculate={calculateSip}
          onReset={resetSip}
        >
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Monthly Investment (₹)</label>
            <input
              type="number"
              value={sipInvestment}
              onChange={e => setSipInvestment(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Expected Annual Return (%)</label>
            <input
              type="number"
              value={sipRate}
              onChange={e => setSipRate(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Investment Duration (Years)</label>
            <input
              type="number"
              value={sipDuration}
              onChange={e => setSipDuration(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {futureValue > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm">Future Value</p>
              <p className="text-base font-medium text-gray-900">
                ₹{parseInt(futureValue).toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </CalculatorCard>

        {/* Gold/Silver Ratio Calculator */}
        <CalculatorCard
          title="Gold/Silver Ratio"
          buttonText="Calculate Ratio"
          onCalculate={calculateGoldSilverRatio}
          onReset={resetGoldSilver}
        >
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Gold Price (USD/oz)</label>
            <input
              type="number"
              value={goldPrice}
              onChange={e => setGoldPrice(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Silver Price (USD/oz)</label>
            <input
              type="number"
              value={silverPrice}
              onChange={e => setSilverPrice(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {ratioError && <p className="text-red-600 text-sm mt-2">{ratioError}</p>}
          {ratioResult && (
            <div className="mt-4 text-center border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm">Gold to Silver Ratio</p>
              <p className="text-3xl font-bold text-gray-900">{ratioResult.value}</p>
              <p className={`mt-2 text-sm font-semibold ${ratioResult.color}`}>
                <span className="mr-1">{ratioResult.icon}</span> {ratioResult.recommendation}
              </p>
            </div>
          )}
        </CalculatorCard>

        {/* Fixed Deposit Calculator */}
        <CalculatorCard
          title="Fixed Deposit Calculator"
          buttonText="Calculate Maturity"
          onCalculate={calculateFD}
          onReset={resetFD}
          isCalculateDisabled={isFdButtonDisabled}
        >
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Amount Deposited (₹)</label>
            <input
              type="number"
              value={fdPrincipal}
              onChange={e => setFdPrincipal(e.target.value)}
              className={`w-full bg-white border ${parseFloat(fdPrincipal) <= 0 ? 'border-red-500' : 'border-gray-300'} text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
            />
            {parseFloat(fdPrincipal) <= 0 && <p className="text-red-500 text-xs mt-1">Amount must be positive.</p>}
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Tenure (Years)</label>
            <input
              type="number"
              value={fdTenure}
              onChange={e => setFdTenure(e.target.value)}
              className={`w-full bg-white border ${(parseFloat(fdTenure) < 1 || parseFloat(fdTenure) > 50) ? 'border-red-500' : 'border-gray-300'} text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
            />
            {(parseFloat(fdTenure) < 1 || parseFloat(fdTenure) > 50) && <p className="text-red-500 text-xs mt-1">Tenure must be 1–50 years.</p>}
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Interest Rate (% p.a.)</label>
            <input
              type="number"
              value={fdRate}
              onChange={e => setFdRate(e.target.value)}
              className={`w-full bg-white border ${parseFloat(fdRate) < 0 ? 'border-red-500' : 'border-gray-300'} text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
            />
            {parseFloat(fdRate) < 0 && <p className="text-red-500 text-xs mt-1">Rate cannot be negative.</p>}
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Compounding Frequency</label>
            <select
              value={fdCompoundFreq}
              onChange={e => setFdCompoundFreq(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="12">Monthly</option>
              <option value="4">Quarterly</option>
              <option value="2">Half-Yearly</option>
              <option value="1">Yearly</option>
            </select>
          </div>
          {fdError && <p className="text-red-600 text-sm mt-2">{fdError}</p>}
          {fdResult && !fdError && (
            <div className="mt-6 text-center border-t border-gray-200 pt-4 space-y-2">
              <div>
                <p className="text-gray-600 text-sm">Maturity Amount</p>
                <p className="text-2xl font-bold text-red-600">₹{parseFloat(fdResult.maturity).toLocaleString('en-IN')}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                <div className="text-left">
                  <p className="text-gray-500">Principal</p>
                  <p className="font-medium text-gray-800">₹{parseFloat(fdResult.invested).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Interest Earned</p>
                  <p className="font-medium text-green-600">₹{parseFloat(fdResult.interest).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Effective Yield</p>
                  <p className="font-medium text-gray-800">{fdResult.yield}%</p>
                </div>
              </div>
            </div>
          )}
        </CalculatorCard>

        {/* Recurring Deposit Calculator */}
        <CalculatorCard
          title="Recurring Deposit (RD) Calculator"
          buttonText="Calculate Maturity"
          onCalculate={calculateRD}
          onReset={resetRD}
          isCalculateDisabled={isRdButtonDisabled}
        >
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Monthly Amount (₹)</label>
            <input
              type="number"
              value={rdMonthlyAmount}
              onChange={e => setRdMonthlyAmount(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm font-medium">Interest Rate (% p.a.)</label>
            <input
              type="number"
              value={rdRate}
              onChange={e => setRdRate(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">Tenure (Years)</label>
              <select
                value={rdYears}
                onChange={e => setRdYears(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {[...Array(11).keys()].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">Months</label>
              <select
                value={rdMonths}
                onChange={e => setRdMonths(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {[0, 3, 6, 9].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          {rdError && <p className="text-red-600 text-sm mt-2 text-center">{rdError}</p>}
          {rdResult && !rdError && (
            <div className="mt-6 text-center border-t border-gray-200 pt-4 space-y-2">
              <div>
                <p className="text-gray-600 text-sm">Maturity Amount</p>
                <p className="text-2xl font-bold text-red-600">₹{parseFloat(rdResult.maturity).toLocaleString('en-IN')}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="text-left">
                  <p className="text-gray-500">Total Invested</p>
                  <p className="font-medium text-gray-800">₹{parseFloat(rdResult.invested).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Interest Earned</p>
                  <p className="font-medium text-green-600">₹{parseFloat(rdResult.interest).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}
        </CalculatorCard>

        {/* Retirement Planning Calculator */}
        <CalculatorCard
          title="Retirement Planning Calculator"
          buttonText="Calculate"
          onCalculate={calculateRetirement}
          onReset={resetRetirement}
          isCalculateDisabled={Object.keys(retirementErrors).length > 0}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={e => setCurrentAge(e.target.value)}
                className={`w-full bg-white border ${retirementErrors.currentAge ? 'border-red-500' : 'border-gray-300'} text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="24"
              />
              {retirementErrors.currentAge && <p className="text-red-500 text-xs mt-1">{retirementErrors.currentAge}</p>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={e => setRetirementAge(e.target.value)}
                className={`w-full bg-white border ${retirementErrors.retirementAge ? 'border-red-500' : 'border-gray-300'} text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="55"
              />
              {retirementErrors.retirementAge && <p className="text-red-500 text-xs mt-1">{retirementErrors.retirementAge}</p>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">Life Expectancy</label>
              <input
                type="number"
                value={lifeExpectancy}
                onChange={e => setLifeExpectancy(e.target.value)}
                className={`w-full bg-white border ${retirementErrors.lifeExpectancy ? 'border-red-500' : 'border-gray-300'} text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="65"
              />
              {retirementErrors.lifeExpectancy && <p className="text-red-500 text-xs mt-1">{retirementErrors.lifeExpectancy}</p>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">Expected Return Rate (% p.a.)</label>
              <input
                type="number"
                value={postRetReturn}
                onChange={e => setPostRetReturn(e.target.value)}
                className={`w-full bg-white border ${retirementErrors.postRetReturn ? 'border-red-500' : 'border-gray-300'} text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="12"
              />
              {retirementErrors.postRetReturn && <p className="text-red-500 text-xs mt-1">{retirementErrors.postRetReturn}</p>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1 text-sm font-medium">Current Annual Expense (₹)</label>
              <input
                type="number"
                value={currentAnnualExpense}
                onChange={e => setCurrentAnnualExpense(e.target.value)}
                className={`w-full bg-white border ${retirementErrors.currentAnnualExpense ? 'border-red-500' : 'border-gray-300'} text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="100000"
              />
              {retirementErrors.currentAnnualExpense && <p className="text-red-500 text-xs mt-1">{retirementErrors.currentAnnualExpense}</p>}
            </div>
          </div>

          {retirementResult && (
            <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
              <div>
                <p className="text-gray-700 text-sm">Retirement Corpus Needed:</p>
                <div className="flex items-baseline">
                  <span className="text-base font-medium text-gray-900">{formatINR(retirementResult.corpus)}</span>
                  <span className="text-red-600 ml-1 text-sm">({(retirementResult.corpus / 100000).toFixed(2)} Lakh)</span>
                </div>
              </div>
              <div>
                <p className="text-gray-700 text-sm">Monthly Savings Required:</p>
                <div className="flex items-baseline">
                  <span className="text-base font-medium text-gray-900">{formatINR(retirementResult.monthlySavings)}</span>
                  <span className="text-red-600 ml-1 text-sm">({(retirementResult.monthlySavings / 1000).toFixed(2)} K)</span>
                </div>
              </div>
              <div>
                <p className="text-gray-700 text-sm">Retirement Annual Expense:</p>
                <div className="flex items-baseline">
                  <span className="text-base font-medium text-gray-900">{formatINR(retirementResult.annualAtRet)}</span>
                  <span className="text-red-600 ml-1 text-sm">({(retirementResult.annualAtRet / 100000).toFixed(2)} Lakh)</span>
                </div>
              </div>
            </div>
          )}
        </CalculatorCard>

      </main>
    </div>
  );
};

export default CalculatorsPage;