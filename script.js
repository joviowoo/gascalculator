// 燃气经济性对比计算器 - 主逻辑脚本

// 获取输入元素和结果元素
const lpgAmountInput = document.getElementById('lpgAmount');
const lpgAmountResult = document.getElementById('lpgAmountResult');
const lpgCostResult = document.getElementById('lpgCostResult');
const ngAmountResult = document.getElementById('ngAmountResult');
const ngCostResult = document.getElementById('ngCostResult');
const savingsResult = document.getElementById('savingsResult');
const savingsPercent = document.getElementById('savingsPercent');

// 计算常数
const LPG_PRICE_PER_KG = 8.27; // 液化石油气单价：元/KG
const NG_PRICE_PER_CUBIC = 4.55; // 管道天然气单价：元/m3
const CONVERSION_RATE = 1.28; // 1KG液化石油气 ≈ 1.28m3天然气

// 格式化数字，保留两位小数
function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 显示加载动画
function showLoading(element) {
    const originalText = element.textContent;
    element.innerHTML = '<span class="loading"></span>';
    return originalText;
}

// 隐藏加载动画
function hideLoading(element, text) {
    element.textContent = text;
}

// 计算并更新所有结果
function calculateResults() {
    // 获取输入值，如果为空或无效则设为0
    const lpgAmount = parseFloat(lpgAmountInput.value) || 0;
    
    // 显示加载状态
    const loadingTexts = [
        showLoading(lpgCostResult),
        showLoading(ngAmountResult),
        showLoading(ngCostResult),
        showLoading(savingsResult)
    ];
    
    // 使用setTimeout让计算过程更平滑
    setTimeout(() => {
        // 液化石油气计算结果
        const lpgCost = lpgAmount * LPG_PRICE_PER_KG;
        
        // 管道天然气计算结果
        const ngAmount = lpgAmount * CONVERSION_RATE;
        const ngCost = ngAmount * NG_PRICE_PER_CUBIC;
        
        // 节省费用计算
        const savings = lpgCost - ngCost;
        const savingsPercentage = lpgCost > 0 ? ((savings / lpgCost) * 100) : 0;
        
        // 更新页面显示
        lpgAmountResult.textContent = formatNumber(lpgAmount);
        lpgCostResult.textContent = formatNumber(lpgCost);
        ngAmountResult.textContent = formatNumber(ngAmount);
        ngCostResult.textContent = formatNumber(ngCost);
        savingsResult.textContent = formatNumber(savings);
        savingsPercent.textContent = savingsPercentage.toFixed(1);
        
        // 根据节省费用调整颜色和动画效果
        const savingsElement = document.querySelector('.savings-value');
        const savingsCard = document.querySelector('.savings-card');
        
        if (savings > 0) {
            savingsElement.style.color = '#64ff96';
            savingsCard.style.borderColor = 'rgba(100, 255, 150, 0.5)';
            savingsCard.style.animation = 'pulse 0.5s ease-in-out';
        } else if (savings < 0) {
            savingsElement.style.color = '#ff6464';
            savingsCard.style.borderColor = 'rgba(255, 100, 100, 0.5)';
        } else {
            savingsElement.style.color = '#ffc850';
            savingsCard.style.borderColor = 'rgba(255, 200, 80, 0.5)';
        }
        
        // 添加脉冲动画
        savingsCard.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            savingsCard.style.animation = '';
        }, 500);
        
    }, 300);
}

// 添加输入事件监听（带防抖）
let debounceTimer;
lpgAmountInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(calculateResults, 300);
});

// 添加键盘快捷键支持
document.addEventListener('keydown', function(event) {
    // Ctrl + R 重置输入
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        lpgAmountInput.value = '';
        calculateResults();
        showNotification('输入已重置', 'info');
    }
    
    // 上/下箭头增加/减少输入值
    if (event.target === lpgAmountInput) {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            const currentValue = parseFloat(lpgAmountInput.value) || 0;
            lpgAmountInput.value = currentValue + 1;
            calculateResults();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            const currentValue = parseFloat(lpgAmountInput.value) || 0;
            lpgAmountInput.value = Math.max(0, currentValue - 1);
            calculateResults();
        }
    }
    
    // F1 显示帮助
    if (event.key === 'F1') {
        event.preventDefault();
        showHelp();
    }
});

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'info' ? '#4facfe' : type === 'success' ? '#64ff96' : '#ff6464'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 显示帮助信息
function showHelp() {
    const helpText = `燃气经济性计算器使用帮助：

? 输入液化石油气月用量（KG）
? 系统自动计算两种燃气的费用对比
? 使用↑↓箭头快速调整数值
? Ctrl+R 重置输入
? 支持触摸屏滑动调整

热值换算：1KG液化气 ≈ 1.28m3天然气`;
    
    alert(helpText);
}

// 页面加载时初始化计算
document.addEventListener('DOMContentLoaded', function() {
    // 设置一个示例初始值，方便演示
    lpgAmountInput.value = '15';
    calculateResults();
    
    // 添加输入框焦点效果
    lpgAmountInput.addEventListener('focus', function() {
        this.select();
        this.style.background = 'rgba(10, 40, 70, 0.9)';
    });
    
    lpgAmountInput.addEventListener('blur', function() {
        this.style.background = 'rgba(5, 20, 40, 0.7)';
    });
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    console.log('燃气经济性计算器已加载完成！');
    console.log('使用方法：输入液化石油气用量，系统自动计算对比结果');
});

// 添加移动端触摸支持
let touchStartY = 0;
lpgAmountInput.addEventListener('touchstart', function(event) {
    touchStartY = event.touches[0].clientY;
    this.style.background = 'rgba(10, 40, 70, 0.9)';
});

lpgAmountInput.addEventListener('touchend', function(event) {
    this.style.background = 'rgba(5, 20, 40, 0.7)';
    const touchEndY = event.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    const currentValue = parseFloat(lpgAmountInput.value) || 0;
    
    // 如果上下滑动距离大于10px，则调整数值
    if (Math.abs(diff) > 10) {
        if (diff > 0) {
            // 向上滑动，增加数值
            lpgAmountInput.value = currentValue + 1;
            showNotification('数值增加 1KG', 'info');
        } else {
            // 向下滑动，减少数值
            lpgAmountInput.value = Math.max(0, currentValue - 1);
            showNotification('数值减少 1KG', 'info');
        }
        calculateResults();
    }
});

// 添加页面可见性检测
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面重新可见时重新计算
        calculateResults();
    }
});

// 添加错误处理
window.addEventListener('error', function(e) {
    console.error('计算器发生错误:', e.error);
    showNotification('计算出现错误，请刷新页面重试', 'error');
});

// 导出函数供其他脚本使用（如果需要）
window.GasCalculator = {
    calculate: calculateResults,
    reset: function() {
        lpgAmountInput.value = '';
        calculateResults();
    },
    setLpgAmount: function(amount) {
        lpgAmountInput.value = amount;
        calculateResults();
    }
};