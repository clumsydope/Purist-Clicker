document.addEventListener('DOMContentLoaded', () => {
    const workerButton = document.querySelector('.worker-button');
    const workerBar = document.querySelector('.worker-bar');
    const workerCount = document.querySelector('.worker-count');
    const workerLoadingBar = document.querySelector('.worker-loading-bar');

    let totalWorker = 0;
    const maxWorker = 10;
    const workerHeatCost = 10;
    let workerTrainTime = 60000; // 60 seconds

    function trainWorker() {
        if (heatAmount < workerHeatCost) {
            console.log('Not enough heat to train a worker.');
            return;
        }
        if (totalWorker >= maxWorker) {
            console.log('Maximum worker limit reached.');
            return;
        }

        // Deduct heat for training
        updateHeatAmount(heatAmount - workerHeatCost);

        // Start training
        workerButton.disabled = true;
        workerLoadingBar.classList.remove('hidden')
        document.documentElement.style.setProperty('--worker-time', `${workerTrainTime}ms`);
        workerLoadingBar.style.transition = `width ${workerTrainTime}ms linear`; // Enable transition
        workerLoadingBar.style.width = '100%';
        
        

        setTimeout(() => {
            totalWorker++;
            workerCount.textContent = `${totalWorker}`;
            workerBar.style.width = `${(totalWorker / maxWorker) * 100}%`;
            workerLoadingBar.style.width = '0%';
            workerLoadingBar.style.transition = 'none';
            workerLoadingBar.classList.add('hidden');

            // Enable worker button if enough heat is available and maxWorker is not reached
            if (heatAmount >= workerHeatCost && totalWorker < maxWorker) {
                workerButton.disabled = false;
            }
        }, workerTrainTime);
    }

    // Enable worker button when heatAmount >= workerHeatCost and maxWorker is not reached
    document.addEventListener('heatAmountUpdated', () => {
        if (heatAmount >= workerHeatCost && totalWorker < maxWorker) {
            workerButton.disabled = false;
        } else {
            workerButton.disabled = true;
        }
    });

    workerButton.addEventListener('click', trainWorker);
});
